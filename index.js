(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var page = document.body.getAttribute('data-page');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function buzz() { if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {} }

  /* ================= text ================= */
  var T = {
    he: { dir: 'rtl', lang: 'EN', pre: 'לזכרו של', rank: 'סרן', name: 'יוגב פזי', hy: 'הי"ד', tap: 'לחצו על יוגב להמשך',
      fell: 'נפל ביום ט"ז בחשוון תשפ"ה', m_idf: 'אתר צה"ל', m_ig: 'עמוד הנצחה', m_eulogies: 'הספדי קרוביו', m_sticker: 'הדפסת מדבקה',
      m_letter: '"מכתב לאהובתי"', m_music: 'מוזיקה שאהב', m_yizkor: 'יזכור', m_life: 'חייו של יוגב', m_gallery: 'גלריית תמונות',
      share: 'שיתוף האתר', shared: 'הקישור הועתק', saveSticker: 'שמירת המדבקה', flipHint: 'לחצו כדי להפוך', full: 'לקריאה המלאה ביזכור',
      back: 'חזרה', lightCandle: 'להדלקת נר לזכרו', contact: 'יצירת קשר', candles: 'נרות הודלקו לזכרו', lit: 'נר הודלק לזכרו', story: 'לסיפור המלא ביזכור' },
    en: { dir: 'ltr', lang: 'עברית', pre: 'In memory of', rank: 'Captain', name: 'Yogev Pazy', hy: 'HY"D', tap: 'Tap Yogev to continue',
      fell: 'Fell on 17 November 2024', m_idf: 'IDF Website', m_ig: "Yogev's Profile", m_eulogies: 'Relatives Eulogies', m_sticker: 'Print A Sticker',
      m_letter: '"A Letter To My Beloved"', m_music: 'Music he liked', m_yizkor: 'Yizkor', m_life: "Yogev's Life", m_gallery: 'Gallery',
      share: 'Share this site', shared: 'Link copied', saveSticker: 'Save the sticker', flipHint: 'Tap to flip', full: 'Read in full on Yizkor',
      back: 'Back', lightCandle: 'Light a candle in his memory', contact: 'Contact us', candles: 'candles lit in his memory', lit: 'Candle lit in his memory', story: 'Read the full story on Yizkor' }
  };
  var lang = store.get('lang') === 'en' ? 'en' : 'he';
  var t = function (k) { return T[lang][k]; };

  var YIZKOR = 'https://www.izkor.gov.il/%D7%99%D7%95%D7%92%D7%91%20%D7%A4%D7%96%D7%99/en_211948fb25a7604f4ce6c9f55e670972';

  /* Eulogies. Short paraphrases of what is written on the Yizkor page.
     To show a person's full words, add  full:{he:'...',en:'...'}  to their entry:
     the back of the card then shows that text instead of the Yizkor link. */
  var HERO = { q: { he: 'האח הכי טוב שיכולתי לבקש', en: 'The best brother I could have asked for' }, by: { he: 'נועם, אחיו', en: 'Noam, his brother' } };
 var E = [
  { w: { he: 'נועם', en: 'Noam' }, r: { he: 'אחיו הצעיר', en: 'His Younger Brother' }, s: { he: 'ספד לו כחבר הכי טוב, כחצי שלו וכנפש תאומה. נזכר באדם שתמיד הציב רף גבוה, ובאיך חינך אותו לאהבת הארץ, ואמר שיוגב ימשיך לחיות איתו לנצח.', en: 'Remembered him as his best friend, his other half and a twin soul. Spoke of a man who always set the bar high and taught him to love the land, and said Yogev will live on with him forever.' } },
  { w: { he: 'שקד', en: 'Shaked' }, r: { he: 'חבר', en: 'Friend' }, s: { he: 'חבר קרוב מתקופת השליחות. נזכר ביוגב כמי שהיה תמיד בטוח באמת שלו, ואמר שיוגב היה רוצה שיהיו גאים בו ולא עצובים.', en: 'A close friend from the shlichut year. Remembered Yogev as always sure of his truth, and said Yogev would have wanted them proud rather than sad.' } },
  { w: { he: 'בילי', en: 'Billi' }, r: { he: 'חברה של המשפחה', en: 'A friend of the family' }, s: { he: 'יוגב אני לא מאמינה שאני צריכה להדליק עבורך נר זיכרון . תמיד תישאר בליבי ובכל כוחי אנסה למלא את צוואתך אוהבת ומתגעגעת', en: 'Yogev I cannot believe I have to light a memorial candle for you . You will always remain in my heart and with all my strength I will try to fulfill your legacy loving and missing you' } },
  { w: { he: 'מאיקי', en: 'Maiki' }, r: { he: 'חברתו הטובה', en: 'His dear friend' }, s: { he: 'יופף שלי, החתיך והמקסים, לראות את התמונות שלך כל פעם שובר לי את הלב. אבל אל תדאג, אני ממשיכה הכל בידיוק כמו שרצית. אני מתגעגעת אלייך. כל כך הרבה.', en: 'My Yogev, handsome and charming, seeing your photos breaks my heart every time. But do not worry, I am continuing everything exactly as you wanted. I miss you. So much.' } },
  { w: { he: 'ירין טורג\'מן', en: 'Yarin Turgeman' }, r: { he: 'חניך של יוגב', en: 'His former scouter' }, s: { he: 'אתגעגע אליך מלא אחי! המדריך שלי לנצח', en: 'I will miss you so much my brother! My counselor forever' } },
  { w: { he: 'איילין בר יוסף', en: 'Eileen Bar Yosef' }, r: { he: 'שכנתו', en: 'His neighbor' }, s: { he: 'יוגב שלנו, ילד יקר ואהוב לא נתפס שאתה לא איתנו החיוך המקסים שלך נעלם. מתגעגעים אליך מאוד, לנצח תישאר בליבנו', en: 'Our Yogev, dear and beloved child, it is incomprehensible that you are not with us, your charming smile is gone. Missing you very much, you will remain in our hearts forever' } },
  { w: { he: 'צאלה', en: 'Tzeela' }, r: { he: 'המורה שלו', en: 'His Teacher' }, s: { he: 'להדליק לזכרך כואב לי בעצמות. כל כך הרבה זמן לא באת לבקר וזה כבר מרגיש כל כך חסר. שיהיה זכרך ברור. אנסה לעשות הכל כדי להיות ראויה', en: 'Lighting a candle in your memory hurts down to my bones. It has been so long since you came to visit and it already feels like such a void. May your memory be blessed. I will try to do everything to be worthy' } },
  { w: { he: 'צפריר', en: 'Tzafrir' }, r: { he: 'דודו', en: 'His Uncle' }, s: { he: 'תיאר אותו כמי שהחיוך שלו הולך איתו לכל מקום.', en: 'Described him as someone whose smile went with him everywhere.' } },
  { w: { he: 'עמיר', en: 'Amir' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'יהי זכרך ברוך.', en: 'May your memory be a belssing' } },
  { w: { he: 'רוני', en: 'Roni' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'תודה שהיית, עדיין לא נקלט שאתה לא בין החיים, גיבור.', en: 'Thank you for being here, it still hasnt sunk in that you are no longer among the living, hero.' } },
  { w: { he: 'רן', en: 'Ran' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'המכתב המרגש שלך הוא עדות לאובדן הגדול של עם ישראל, יהיה זכרך ברוך גיבור ישראל.', en: 'Your touching letter is a testament to the great loss of the people of Israel. May your memory be blessed, hero of Israel.' } },
  { w: { he: 'יהל דאנה', en: 'Yahel Dana' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'לנצח אנצור בליבי זכרך,גיבור ישראל שנלחם על הגנת מולדתי.', en: 'I will forever treasure your memory in my heart, hero of Israel who fought to defend my homeland.' } },
  { w: { he: 'עידן בלום', en: 'Idan Blum' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'היי יוגב זה התלמיד שלך לשעבר אולי אתה מסתכל עליי מלמעלה ורואה איך גדלתי. רק רציתי שתדע כמה השפעת עליי בכמה ימים שהיית מורה מחליף אצלי בכיתה הייתה לך דרך לימוד מיוחדת וכל הכיתה אהבה את זה ובמיוחד אני ואגב אני עדיין זוכר את "החנוכייה של סבא" בעל פה וזה בזכותך ואגב לגבי מה שאני ואיתן עשינו בקבר שלך אני מקווה שתסלח לנו על זה היינו פשוט צריכים את הגפרורים. תודה שהיית בחיים שלי ותהנה שם למעלה', en: 'Hey Yogev, it is your former student. Maybe you are looking down at me from above and seeing how I have grown. I just wanted you to know how much of an impact you had on me in the few days you were a substitute teacher in my class. You had a special way of teaching and the whole class loved it, especially me. By the way, I still remember "Grandpa Menorah" by heart and that is thanks to you. Also, regarding what Eitan and I did at your grave, I hope you will forgive us for that, we just needed the matches. Thank you for being in my life, and enjoy it up there.' } },
  { w: { he: 'בן יעקב', en: 'Ben Yaakov' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'יוגב היקר מלח הארץ זוכרים אותך כל יום', en: 'Dear Yogev, salt of the earth, we remember you every day.' } },
  { w: { he: 'אלית טל', en: 'Elit Tal' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'יהי זכרך ברוך גיבור ישראל אמיץ. תודה שהגנת עלינו. לא נשכח ולא נסלח. הי"ד.', en: 'May your memory be blessed, brave hero of Israel. Thank you for protecting us. We will not forget and we will not forgive. May God avenge his blood.' } },
  { w: { he: 'איילה תם צור', en: 'Ayala Tam Tzur' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'כשבן נקרע מאימו זה שברון לב שאינו ניתן לאיחוי. לא הכרתי אותך אישית אני בטוחה שהיית ילד ערכי ואהוב. חיותה יקרה, הלב איתך.', en: 'When a son is torn from his mother, it is a heartbreak that cannot be mended. I did not know you personally, but I am certain you were a loving child with strong values. Dear Chayuta, my heart goes out to you.' } },
  { w: { he: 'שרית', en: 'Sarit' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'יוגבי אתה חסר....עדיין לא מסוגלת לדבר עלייך בלשון עבר. חסרה לי הקריאה שלך....ברקוביץ', en: 'Yogevi you are missed....still unable to speak about you in past tense. I miss your call....Berkowitz' } },
  { w: { he: 'עפרה', en: 'Ofra' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'תודה לך,יוגב היקר, על שהגנת עלינו , במחיר ההקרבה הנוראה מכל. תנחומים מלב כואב לכל משפחתך. יהא זכרך ברוך,גיבור ישראל', en: 'Thank you, dear Yogev, for protecting us, at the cost of the most terrible sacrifice of all. Condolences from an aching heart to all your family. May your memory be blessed, hero of Israel' } },
  { w: { he: 'ליזה וולף', en: 'Liza Wolf' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'מתגעגעים יקר יוגבי', en: 'Missing you dear Yogevi' } },
  { w: { he: 'אתי יעקב', en: 'Eti Yaakov' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'גיבור ישראל.....יהי זכרך ברוך.....', en: 'Hero of Israel.....May your memory be blessed.....' } },
  { w: { he: 'טליה שמיר', en: 'Talia Shamir' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'חבר ילדות שלי המלאך הכי יפה בגן עדן וההפסד הכי גדול שיש למדינה אוהבים אותך תודה על מי שהיית', en: 'My childhood friend the most beautiful angel in heaven and the greatest loss for the country we love you thank you for who you were' } },
  { w: { he: 'בנימין קליין', en: 'Benjamin Klein' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'משפחת פזי היקרה, שמי שמך, ואני תלמיד מלוס אנגלס. ברצוני להביע את תנחומיי הכנים על אובדנו של יוגב ז"ל. יוגב היה דמות מעוררת השראה, לוחם אמיץ ואדם אהוב. אנו נזכור את תרומתו ואת הערכים עליהם עמד. אנו מעריכים את הקרבתו למען עם ישראל, ואני מאחל שנשמתו תעלה מעלה ותנוח בשלום. אנו שולחים לכם חיבוק חם ומאחלים לכם כוח ונחמה. בנימין קליין', en: 'Dear Pazy family, my name is your name, and I am a student from Los Angeles. I would like to express my sincere condolences on the loss of Yogev, may his memory be blessed. Yogev was an inspiring figure, a brave warrior, and a beloved person. We will remember his contribution and the values he stood for. We appreciate his sacrifice for the people of Israel, and I wish that his soul may ascend above and rest in peace. We send you a warm hug and wish you strength and comfort. Benjamin Klein' } },
  { w: { he: 'יסמין קופרשטיין', en: 'Yasmin Kuperstein' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'נשמתך בגן עדן ילד אהוב', en: 'May your soul be in heaven beloved child' } },
  { w: { he: 'נורית', en: 'Nurit' }, r: { he: 'מתוך אתר יזכור', en: 'From The Yizkor Website' }, s: { he: 'יוגב זוכרת אותך כילד בגן בשנתך האחרונה נכנסתי באמצע השנה להיות סייעת שלכם החיוך הכובש שלך בלתי נשכח אוהבת', en: 'Yogev I remember you as a child in kindergarten in your last year I joined in the middle of the year to be your assistant teacher your captivating smile is unforgettable with love' } }
];

  var LETTER = {
    he: ['מכתב לאהובתי / יוגב פזי',
      'היי אהובתי, זה אני. כן נכון, אני יודע. עבר זמן רב מאז שהתראנו, התרחקתי לתקופה ארוכה. שלא תחשבי לרגע שהיה לי קל בלעדייך, את יודעת כמה אני אוהב אותך. אבל את חייבת לדעת ולזכור, זה היה בשבילך. בשבילנו.',
      'כל כך הרבה אנשים שפגשתי מכירים אותך וצדדים חדשים בך. מכירים את מערכת היחסים ביננו, את מה שאת בשבילי ומה שאני בשבילך. עבדתי יום ולילה על מנת להאדיר את שמך, לתמוך בך ולהראות את כל צדדייך המופלאים. למדתי ושמעתי המון, אך גם השמעתי ולימדתי המון.',
      'נכון, אי אפשר לשכוח את הימים הארוכים במיוחד בלעדייך, אלה שגם את וגם אני היינו צריכים אחד את השנייה מתמיד. תזכרי שתמיד היית ותמיד תהיי לפניי, חושב עלייך בכל דקה ודקה. בקרוב אני חוזר, אוהב יותר מאי פעם. מוכן ללבוש את המדים ולהגן עלייך בגאווה. לא יכול לחכות לרגע שבו נפגש שוב. והפעם, הפעם אני נשאר. לתמיד.',
      'אוהב אותך מדינה שלי, את הדגל, את הסמל ואת ההמנון. אוהב את הערים היישובים והנופים שבך. אוהב את המגוון הרחב של האנשים, אוהב את האמונה והיהדות שבך. אוהב את המשפחה והחברים שלי, אלה שרכשתי ואלו שארכוש בזכותך. נתראה בקרוב, יוגב.',
      'מכתב שכתב יוגב פזי בתום שליחותו בשיקגו כש"ש של הסוכנות היהודית בשנת 2021, שנהיה ראויים לו.'],
    en: ['A Letter To My Beloved / Yogev Pazi',
      "Hi my beloved, it's me. Yes, I know. It's been a long time since we've seen each other, I've been distant for a long period. Don't think for a moment that it was easy without you - you know how much I love you. But you must know and remember, it was for you. For us.",
      "So many people I've met know you and new sides of you. They know about our relationship, what you are to me and what I am to you. I worked day and night to glorify your name, to support you and to show all your wonderful sides. I learned and heard so much, but I also taught and shared so much.",
      "True, we can't forget those especially long days without you, those when both you and I needed each other more than ever. Remember that you were always and will always be before me, thinking of you every minute. Soon I'm coming back, loving more than ever. Ready to wear the uniform and protect you with pride. I can't wait for the moment when we meet again. And this time, this time I'm staying. Forever.",
      "I love you my country, your flag, your symbol and your anthem. I love your cities, settlements and landscapes. I love the wide diversity of your people, love the faith and Judaism within you. I love my family and friends, those I've acquired and those I will acquire thanks to you. See you soon, Yogev.",
      'This letter was written by Yogev Pazi at the end of his shlichut in Chicago as a Jewish Agency Shinshin. May we be worthy of him.']
  };

  /* ================= shared chrome ================= */
  var stage = $('.stage');
  var back = page === 'splash' ? '' :
    '<a id="backBtn" class="chip" data-go href="' + (page === 'choice' ? 'index.html' : 'ChoicePage.html') + '" aria-label="Back">' +
    '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div id="bg" aria-hidden="true"><div class="bg-photo" data-depth="-14"></div><div class="bg-shade"></div>' +
    '</div>' + (page === 'splash' ? '<div class="bg-yogev" data-depth="22"><img src="Images/YogevNoBg.png" alt=""></div>' : '') +
    (page === 'choice' ? '<div class="menu-photo"><img src="Images/YOGEVbg.jpg" alt="" data-depth="10"></div>' : '') +
    '<div id="candleGlow" aria-hidden="true"></div>' +
    '<header id="bar">' + back + '<span class="spacer"></span>' +
    '<button id="candleBtn" class="chip" aria-pressed="false"><svg viewBox="0 0 24 24" width="20" height="20"><path class="flame" d="M12 2c2 3 4 4.8 4 7.5a4 4 0 0 1-8 0C8 7 10 6 10.5 4 11.3 4.8 12 5 12 2z" fill="currentColor"/><rect x="9" y="14" width="6" height="8" rx="1.5" fill="currentColor"/></svg><span class="ctxt" data-i="lightCandle"></span></button>' +
    '<button id="langBtn" class="chip" aria-label="Language"><span id="langTxt"></span></button></header>' +
    '<div id="toast" role="status"></div>';
  while (wrap.firstChild) document.body.insertBefore(wrap.firstChild, stage);


  function toast(m) { var el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(function () { el.classList.remove('show'); }, 1800); }

  /* ================= navigation with 3D leave ================= */
  function askTilt() {
    var D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === 'function' && !store.get('tilt')) {
      store.set('tilt', '1');
      return D.requestPermission().catch(function () {});
    }
    return Promise.resolve();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-go]') : null;
    if (!a) return;
    e.preventDefault(); buzz();
    var url = a.getAttribute('href');
    askTilt().then(function () {
      document.body.classList.add('leaving');
      setTimeout(function () { location.href = url; }, reduce ? 0 : 300);
    });
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('leaving'); });

  /* ================= 3D tilt / parallax (gyro on phones, finger drag as fallback) ================= */
  var tx = 0, ty = 0, cx = 0, cy = 0, gyro = false, raf = 0;
  var layers = [].slice.call(document.querySelectorAll('[data-depth],[data-tilt]'));
  function clamp(v) { return Math.max(-1, Math.min(1, v)); }
  function frame() {
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    layers.forEach(function (el) {
      var d = el.getAttribute('data-depth');
      if (d !== null) el.style.transform = 'translate3d(' + (cx * d).toFixed(2) + 'px,' + (cy * d * 0.6).toFixed(2) + 'px,0)';
      else { el.style.setProperty('--tx', cx.toFixed(3)); el.style.setProperty('--ty', cy.toFixed(3)); }
    });
    raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(frame) : 0;
  }
  function kick() { if (!raf && !reduce && !document.hidden) raf = requestAnimationFrame(frame); }
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null) return;
    gyro = true; tx = clamp(e.gamma / 28); ty = clamp((e.beta - 55) / 32); kick();
  });
  function pointer(e) {
    if (gyro) return;
    var p = e.touches ? e.touches[0] : e;
    tx = (p.clientX / innerWidth - 0.5) * 2; ty = (p.clientY / innerHeight - 0.5) * 2; kick();
  }
  window.addEventListener('pointermove', pointer, { passive: true });
  window.addEventListener('touchmove', pointer, { passive: true });
  if (!reduce) { tx = 0.0001; kick(); }

  /* ================= candle ================= */
  function setCandle(on) { document.body.classList.toggle('candle', on); $('#candleBtn').setAttribute('aria-pressed', on); store.set('candle', on ? '1' : '0'); }
  $('#candleBtn').onclick = function () {
    buzz(); var on = !document.body.classList.contains('candle'); setCandle(on); if (on) lightRemote();
  };

  setCandle(store.get('candle') === '1');

  /* ================= candle counter (Netlify Function /api/candles) ================= */
  var API = '/api/candles', cnt = null;
  function showCount() {
    var el = $('#candleLine'); if (!el || cnt == null) return;
    var old = el.getAttribute('data-n');
    el.hidden = false; el.setAttribute('data-n', cnt);
    el.innerHTML = '<b>' + cnt.toLocaleString(lang === 'he' ? 'he-IL' : 'en-US') + '</b>' + t('candles');
    if (old !== null && +old !== cnt) el.firstChild.classList.add('bump');
  }
  function loadCount() {
    fetch(API, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { cnt = d.count; showCount(); }).catch(function () {});
  }
  function lightRemote() {            // one counted candle per device per day
    var day = new Date().toDateString();
    if (store.get('litDay') === day) return;
    store.set('litDay', day);
    fetch(API, { method: 'POST' }).then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.count != null) { cnt = d.count; showCount(); toast(t('lit')); }
    }).catch(function () { store.set('litDay', ''); });
  }
  if (page === 'choice') { loadCount(); setInterval(function () { if (!document.hidden) loadCount(); }, 45000); }

  /* wrap every "Yogev" / "יוגב" so the candle can warm it up */
  function glowNames(root) {
    var test = /יוגב|Yogev/, list = [], n, w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while ((n = w.nextNode())) {
      if (test.test(n.nodeValue) && !(n.parentNode.closest && n.parentNode.closest('.yn,script,style'))) list.push(n);
    }
    list.forEach(function (node) {
      var f = document.createDocumentFragment();
      node.nodeValue.split(/(יוגב|Yogev)/).forEach(function (part, i) {
        if (i % 2) { var sp = document.createElement('span'); sp.className = 'yn'; sp.textContent = part; f.appendChild(sp); }
        else if (part) f.appendChild(document.createTextNode(part));
      });
      node.parentNode.replaceChild(f, node);
    });
  }

  /* ================= language ================= */
  $('#langBtn').onclick = function () {
    buzz(); lang = lang === 'he' ? 'en' : 'he'; store.set('lang', lang);
    if (!reduce) { stage.style.animation = 'none'; void stage.offsetWidth; stage.style.animation = 'langFlip .7s var(--ease) both'; }
    setTimeout(applyLang, reduce ? 0 : 120);
  };
  function applyLang() {
    document.documentElement.lang = lang; document.documentElement.dir = T[lang].dir;
    document.title = lang === 'he' ? 'לזכרו של סרן יוגב פזי הי"ד' : 'In memory of Captain Yogev Pazy HY"D';
    document.querySelectorAll('[data-i]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i')); });
    $('#langTxt').textContent = t('lang');
    var bk = $('#backBtn'); if (bk) bk.setAttribute('aria-label', t('back'));
    if (R[page]) R[page]();
    glowNames(stage);
  }

  /* ================= page renderers ================= */
  var R = {};
  var CHEV = '<svg class="arr in" viewBox="0 0 24 24" width="22" height="22"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var OUT = '<svg class="arr" viewBox="0 0 24 24" width="20" height="20"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MENU = [
    ['m_life', 'YogevLife.png', 'YogevsLife.html'],
    ['m_gallery', 'GalleryLogo.png', 'Gallery.html'],
    ['m_letter', 'LetterLogo.png', 'letterToMyBeloved.html'],
    ['m_eulogies', 'GilLogo.png', 'YogevEulogies.html'],
    ['m_sticker', 'PrintIcon.png', 'PrintSticker.html'],
    ['m_music', 'SpotifyLogo.png', 'https://open.spotify.com/user/9nhqhq3ep8ujb2me5753kidd2?si=4yPMEk1PQ7aeV0PRgA0M-Q', 1],
    ['m_idf', 'IDFlogo.png', 'https://www.idf.il/נופלים/חללי-המלחמה/יוגב-פזי/'],
    ['m_yizkor', 'YizkorLogo.png', YIZKOR],
    ['m_ig', 'IgLogo.png', 'https://www.instagram.com/remember_yogev_pazy/']
  ];
  R.choice = function () {
    $('#menu').innerHTML = MENU.map(function (m, i) {
      var ext = /^http/.test(m[2]);
      return '<a class="row' + (m[3] ? ' sep' : '') + '" style="--i:' + i + '" href="' + m[2] + '" ' + (ext ? 'target="_blank" rel="noopener"' : 'data-go') + '>' +
        '<span class="ic"><img src="Images/' + m[1] + '" alt=""></span><span>' + t(m[0]) + '</span>' + (ext ? OUT : CHEV) + '</a>';
    }).join('');
    showCount();
  };

  R.letter = function () {
    var L = LETTER[lang], h = '<h2>' + L[0] + '</h2>';
    for (var i = 1; i < L.length; i++) h += '<p style="--i:' + i + '"' + (i === L.length - 1 ? ' class="sig"' : '') + '>' + L[i] + '</p>';
    var a = $('#letter'); a.innerHTML = h; a.dir = T[lang].dir;
  };

  function paras(x) { return x.split(/\n\s*\n/).map(function (p) { return '<p>' + p + '</p>'; }).join(''); }
  R.eulogies = function () {
    $('#heroQ').innerHTML = HERO.q[lang] + '<small>' + HERO.by[lang] + '</small>';
    var car = $('#cards');
    car.innerHTML = E.map(function (p) {
      var m = p.s[lang].match(/^.*?[.!?](\s|$)/), first = m ? m[0] : p.s[lang];
      var back = p.full ? paras(p.full[lang]) : '<p>' + p.s[lang] + '</p><a class="go" href="' + YIZKOR + '" target="_blank" rel="noopener">' + t('full') + '</a>';
      return '<div class="fc" role="button" tabindex="0" aria-label="' + p.w[lang] + '"><div class="fc-in">' +
        '<div class="face f"><h3>' + p.w[lang] + '</h3><span class="rel">' + p.r[lang] + '</span><p>' + first + '</p><span class="hint">' + t('flipHint') + '</span></div>' +
        '<div class="face b"><h3>' + p.w[lang] + '</h3><span class="rel">' + p.r[lang] + '</span>' + back + '</div></div></div>';
    }).join('');
    var cards = [].slice.call(car.children), dots = $('#dots');
    dots.innerHTML = cards.map(function () { return '<i></i>'; }).join('');
    function flow() {
      var mid = innerWidth / 2, best = 0, bd = 9;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect(), d = (r.left + r.width / 2 - mid) / r.width;
        d = Math.max(-1.6, Math.min(1.6, d));
        c.style.transform = 'perspective(900px) rotateY(' + (-d * 40).toFixed(1) + 'deg) scale(' + (1 - Math.abs(d) * 0.12).toFixed(3) + ')';
        c.style.opacity = (1 - Math.min(1, Math.abs(d)) * 0.45).toFixed(2);
        if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
      });
      [].forEach.call(dots.children, function (d, i) { d.className = i === best ? 'on' : ''; });
    }
    cards.forEach(function (c, i) {
      c.onclick = function (e) { if (e.target.closest('a')) return; buzz(); c.classList.toggle('flip'); };
      c.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } };
      dots.children[i].onclick = function () { c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };
    });
    var tick = 0; car.onscroll = function () { if (!tick) tick = requestAnimationFrame(function () { tick = 0; flow(); }); };
    window.onresize = flow; requestAnimationFrame(flow);
  };

  /* ---- Yogev's life: our own wording of the facts on his Yizkor page ----
     To show the official text instead, paste it into LIFE_FULL (paragraphs separated by a blank line). */
  var LIFE_FULL = null; // e.g. { he: 'פסקה ראשונה\n\nפסקה שנייה', en: 'First paragraph\n\nSecond paragraph' }
  var LIFE = {
    lead: { he: 'חיוך שהאיר לכל מי שסביבו, אהבה עמוקה לנגב ולארץ, וחלום להקים בנגב יישוב חדש.',
            en: 'A smile that lit up everyone around him, a deep love for the Negev and for the country, and a dream of founding a new community in the Negev.' },
    ev: [
      { y: { he: '2002', en: '2002' }, h: { he: 'ילדות בנגב', en: 'Growing up in the Negev' },
        t: { he: 'נולד בתל אביב כבכור לחיותא וגיל, אח לנועם, מור וברק. מכיתה א׳ גדל בגבעות בר שבצפון הנגב, ילד סקרן ופעלתן.',
             en: 'Born in Tel Aviv, the eldest son of Chayuta and Gil, and brother to Noam, Mor and Barak. From first grade he grew up in Givot Bar in the northern Negev, a curious and energetic child.' } },
      { y: { he: 'נעורים', en: 'Youth' }, h: { he: 'צופים והדרכה', en: 'Scouts and guiding' },
        t: { he: 'מכיתה ד׳ היה בצופים, ומאוחר יותר הפך למדריך ולרכז מוביל בשבט. ילדי היישוב ראו בו אח גדול וחבר. בצד שיחק כדורסל עד גיל שש עשרה.',
             en: 'A Scout from fourth grade, he later became a counselor and lead coordinator in his troop. The local kids saw him as a big brother and a friend. He also played basketball until sixteen.' } },
      { y: { he: 'גילאי 12 עד 14', en: 'Ages 12 to 14' }, h: { he: 'קסמים ובלונים', en: 'Magic and balloons' },
        t: { he: 'בגיל שתים עשרה קיבל ערכת קסמים, בגיל שלוש עשרה כבר הופיע כקוסם בימי הולדת, ובגיל ארבע עשרה פתח עסק קטן להפעלת אירועים עם בלונים.',
             en: 'At twelve he got a magic kit, at thirteen he was performing at birthday parties, and at fourteen he started a small business running events with balloons.' } },
      { y: { he: 'כיתה י״א', en: 'Eleventh grade' }, h: { he: 'מנהיגות', en: 'Leadership' },
        t: { he: 'השתתף בתוכנית "מנהיגות ביחד" ויצא כעוזר מדריך למחנה קיץ במונטריאול, חוויה שהעמיקה את הזיקה שלו לציונות.',
             en: 'He joined the "Leadership Together" program and flew to Montreal as an assistant counselor at a summer camp, an experience that deepened his Zionism.' } },
      { y: { he: 'שנת שירות', en: 'Year of service' }, h: { he: 'שיקגו', en: 'Chicago' },
        t: { he: 'אחרי התיכון יצא לשנת שירות של הסוכנות היהודית בשיקגו. התנדב בבית ספר, בבית כנסת ובמרכז קהילתי, והקים עם חבריו את שבט הצופים הראשון של הקהילה הישראלית שם. בסיומה כתב את "מכתב לאהובתי".',
             en: 'After high school he did a Jewish Agency year of service in Chicago. He volunteered at a school, a synagogue and a community center, and with his friends founded the first Scouts troop of the Israeli community there. At its end he wrote "A Letter To My Beloved".' } },
      { y: { he: 'דצמבר 2021', en: 'December 2021' }, h: { he: 'גיוס', en: 'Enlistment' },
        t: { he: 'התגייס ליחידת הקומנדו אגוז, ובסיום ההכשרה הצטרף לצוות מפעילי הרחפנים.',
             en: 'He enlisted in the Egoz commando unit and, after training, joined its drone operators team.' } },
      { y: { he: '2023', en: '2023' }, h: { he: 'המלחמה', en: 'The war' },
        t: { he: 'ב־7 באוקטובר הוזעק עם היחידה להילחם באזור מסיבות הטבע במערב הנגב, ובהמשך נכנס לרצועת עזה כמה פעמים. בדצמבר נפל בן דודו גל מאיר איזנקוט, ויוגב קעקע על ידו תמונת ילדות שלהם יחד.',
             en: 'On October 7 he was called with his unit to fight near the nature-party sites in the western Negev, and later entered Gaza several times. In December his cousin Gal Meir Eisenkot fell, and Yogev tattooed a childhood photo of the two of them on his arm.' } },
      { y: { he: '2024', en: '2024' }, h: { he: 'מפקד מחלקה', en: 'Platoon commander' },
        t: { he: 'יצא לקורס קצינים ומונה למפקד מחלקה בגדוד נחשון בחטיבת כפיר. חייליו זכרו אותו כמי שהולך בראש, תומך ועומד לרשותם תמיד.',
             en: 'He completed officers course and became a platoon commander in the Nachshon battalion of the Kfir brigade. His soldiers remember a commander who led from the front and was always there for them.' } },
      { y: { he: '17.11.2024', en: '17 November 2024' }, h: { he: 'נפילה', en: 'Fell in battle' },
        t: { he: 'נפל בקרב בג׳באליה שבצפון הרצועה, בן 22. הובא למנוחות בגבעות בר, הראשון שנקבר שם, והועלה לדרגת סרן. הותיר הורים, שני אחים ואחות.',
             en: 'He fell in battle in Jabaliya in northern Gaza, aged 22. He was laid to rest in Givot Bar, the first grave there, and was posthumously promoted to Captain. He leaves his parents, two brothers and a sister.' } },
      { y: { he: 'הנצחה', en: 'Remembrance' }, h: { he: 'הבלון של יוגב', en: "Yogev's Balloon" },
        t: { he: 'בגבעות בר הוקם לזכרו מיצג בלונים ענק בידי אמני בלונים מהארץ. יוגב מונצח גם ביחידת אגוז, בבית כפיר במודיעין ובאתר ההנצחה של חטיבת כפיר בעפולה.',
             en: "A giant balloon installation was built in his memory in Givot Bar by balloon artists from across the country. He is also commemorated at the Egoz unit, at Beit Kfir in Modi'in and at the Kfir brigade memorial site in Afula." } }
    ]
  };
  R.life = function () {
    $('#lead').textContent = LIFE.lead[lang];
    $('#story').innerHTML = LIFE_FULL ? paras(LIFE_FULL[lang]) :
      LIFE.ev.map(function (e, i) {
        return '<div class="ev" style="--i:' + i + '"><small>' + e.y[lang] + '</small><h3>' + e.h[lang] + '</h3><p>' + e.t[lang] + '</p></div>';
      }).join('');
    var l = $('#srcLink'); l.href = YIZKOR; l.textContent = t('story');
  };

  /* gallery */
  var G = '10___8505,13___8508,37___4275,52___6434,89___6471,786D58B7-25ED-4D1F-BEF5-681011912B03,20171213_171118,EO_3BC2019_20210616_3080,GOPR0234_Original,GOPR0725,IMG_0158,IMG_0669,IMG_0862,IMG_0881,IMG_0975,IMG_1021,IMG_1167,IMG_1278,IMG_1279,IMG_1438,IMG_1650,IMG_3387,IMG_3408,IMG_6252,IMG_6494,IMG_9177,IMG_9180,IMG_9207,IMG_9891,IMG_9985,IMG-20160908-WA0014,IMG-20170113-WA0013,IMG-20170602-WA0020,IMG-20170728-WA0010,IMG-20170728-WA0021,IMG-20180204-WA0042,IMG-20180310-WA0008,IMG-20180525-WA0011,IMG-20180525-WA0014,IMG-20180624-WA0026,IMG-20180706-WA0036,IMG-20181108-WA0031,IMG-20181204-WA0035,IMG-20190302-WA0018,IMG-20190320-WA0027,IMG-20190322-WA0102,IMG-20190809-WA0015,IMG-20191114-WA0057,IMG-20200103-WA0023,IMG-20200222-WA0019,IMG-20200222-WA0031,IMG-20200429-WA0093,IMG-20200530-WA0007,IMG-20200616-WA0016,IMG-20200702-WA0045,IMG-20200711-WA0012,IMG-20201110-WA0027,IMG-20210104-WA0002,IMG-20210105-WA0005,IMG-20210221-WA0026,IMG-20211201-WA0033,IMG-20211202-WA0142,IMG-20211211-WA0013,IMG-20220724-WA0026,IMG-20221104-WA0008,IMG-20221120-WA0120,IMG-20230903-WA0015,IMG-20231015-WA0038,IMG-20240531-WA0002,IMG-20240916-WA0026,Screenshot_20190916-170540_Instagram'.split(',');
  var items = [{ t: 'i', s: '__52___3976 - עותק.jpg' }]
    .concat(G.map(function (n) { return { t: 'i', s: n + '.jpg' }; }))
    .concat([{ t: 'v', s: 'VID-20181205-WA0034.mp4' }, { t: 'v', s: 'VID-20191230-WA0013.mp4' }]);
  var li = 0, lb, lbStage;
  function showLB(i, dir) {
    li = (i + items.length) % items.length;
    var it = items[li], url = 'Images/Gallery/' + encodeURIComponent(it.s), el;
    if (it.t === 'i') { el = new Image(); el.src = url; }
    else { el = document.createElement('video'); el.src = url; el.controls = true; el.autoplay = true; el.loop = true; el.playsInline = true; el.setAttribute('playsinline', ''); }
    el.style.opacity = 0; el.style.transform = 'perspective(900px) rotateY(' + (dir || 0) * -40 + 'deg) translateX(' + (dir || 0) * 50 + 'px)';
    lbStage.innerHTML = ''; lbStage.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.style.opacity = 1; el.style.transform = 'none'; }); });
  }
  function closeLB() { lb.hidden = true; lbStage.innerHTML = ''; }
  R.gallery = null;
  if (page === 'gallery') {
    lb = document.createElement('div'); lb.id = 'lightbox'; lb.hidden = true; lb.dir = 'ltr';
    lb.innerHTML = '<button class="chip" aria-label="Close">✕</button><div id="lbStage"></div>';
    document.body.appendChild(lb); lbStage = $('#lbStage'); lb.firstChild.onclick = closeLB;
    var gal = $('#gallery'), io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
    }, { root: stage, rootMargin: '0px 0px 140px 0px' }) : null;
    items.forEach(function (it, idx) {
      var url = 'Images/Gallery/' + encodeURIComponent(it.s), el;
      if (it.t === 'i') { el = new Image(); el.loading = 'lazy'; el.decoding = 'async'; el.alt = ''; el.src = url; }
      else { el = document.createElement('video'); el.src = url + '#t=0.1'; el.muted = true; el.loop = true; el.playsInline = true; el.setAttribute('playsinline', ''); el.preload = 'metadata'; }
      el.onclick = function () { buzz(); lb.hidden = false; showLB(idx, 0); };
      el.onerror = function () { el.style.display = 'none'; };
      gal.appendChild(el); if (io) io.observe(el); else el.classList.add('seen');
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') showLB(li + 1, 1);
      if (e.key === 'ArrowRight') showLB(li - 1, -1);
    });
    var sx = 0, sy = 0;
    lbStage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lbStage.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dy) > 90 && Math.abs(dy) > Math.abs(dx)) return closeLB();
      if (Math.abs(dx) > 50) showLB(li + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* sticker: share sheet on phones, download as fallback */
  var sb = $('#stickerBtn');
  if (sb) sb.onclick = function () {
    buzz();
    var url = 'Images/YogevPazySticker.png';
    fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
      var f = new File([b], 'RememberYogevPazySticker.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f] });
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'RememberYogevPazySticker.png';
      document.body.appendChild(a); a.click(); a.remove();
    }).catch(function () { window.open(url, '_blank'); });
  };

  var sh = $('#shareBtn');
  if (sh) sh.onclick = function () {
    buzz();
    var d = { title: document.title, url: location.href.split('#')[0].replace(/[^\/]*$/, '') };
    if (navigator.share) navigator.share(d).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(d.url).then(function () { toast(t('shared')); });
  };

  applyLang();
})();
