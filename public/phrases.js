class EmotionPhrases {
  constructor(manifestUrl = "/phrases.json", audioRoot = "/audio") {
    this.manifestUrl = manifestUrl;
    this.audioRoot = audioRoot;
    this.data = {};
    this.cache = new Map();
    this.current = null;
    this.lastIndex = {}; // чтобы не повторять один и тот же вариант подряд
  }

  async init() {
    const res = await fetch(this.manifestUrl);
    this.data = await res.json();
  }

  _url(emotion, category, index) {
    return `${this.audioRoot}/${emotion}/${category}_${index + 1}.wav`;
  }

  // Выбрать вариант (случайный, но не тот же, что в прошлый раз)
  pick(emotion, category) {
    const variants = this.data[emotion]?.[category];
    if (!variants?.length) return null;

    const key = `${emotion}/${category}`;
    let i = Math.floor(Math.random() * variants.length);
    if (variants.length > 1 && i === this.lastIndex[key]) {
      i = (i + 1) % variants.length;
    }
    this.lastIndex[key] = i;

    return { index: i, text: variants[i], url: this._url(emotion, category, i) };
  }

  // Вернуть текст и сразу проиграть озвучку
  say(emotion, category, index = null) {
    const variants = this.data[emotion]?.[category];
    if (!variants) { console.warn("Нет фразы:", emotion, category); return null; }

    const phrase = index === null
      ? this.pick(emotion, category)
      : { index, text: variants[index], url: this._url(emotion, category, index) };

    this._play(phrase.url);
    return phrase.text; // его вы выводите на экран
  }

  _play(url) {
    this.stop();
    let audio = this.cache.get(url);
    if (!audio) { audio = new Audio(url); this.cache.set(url, audio); }
    audio.currentTime = 0;
    this.current = audio;
    audio.play().catch(e => console.warn("Звук заблокирован браузером:", e));
  }

  stop() {
    if (this.current) { this.current.pause(); this.current.currentTime = 0; }
  }

  // Предзагрузка всех фраз одной эмоции (вызывать при смене эмоции)
  preloadEmotion(emotion) {
    for (const [cat, list] of Object.entries(this.data[emotion] || {})) {
      list.forEach((_, i) => {
        const url = this._url(emotion, cat, i);
        if (!this.cache.has(url)) {
          const a = new Audio(url);
          a.preload = "auto";
          this.cache.set(url, a);
        }
      });
    }
  }
}

const phrases = new EmotionPhrases();