(function () {
  var API_BASE = "https://cdn.jsdelivr.net/gh/wldeh/bible-api@main/bibles/en-kjv/books";

  var BIBLE_BOOKS = [
    { slug: "genesis", name: "Genesis", chapters: 50, testament: "ot" },
    { slug: "exodus", name: "Exodus", chapters: 40, testament: "ot" },
    { slug: "leviticus", name: "Leviticus", chapters: 27, testament: "ot" },
    { slug: "numbers", name: "Numbers", chapters: 36, testament: "ot" },
    { slug: "deuteronomy", name: "Deuteronomy", chapters: 34, testament: "ot" },
    { slug: "joshua", name: "Joshua", chapters: 24, testament: "ot" },
    { slug: "judges", name: "Judges", chapters: 21, testament: "ot" },
    { slug: "ruth", name: "Ruth", chapters: 4, testament: "ot" },
    { slug: "1-samuel", name: "1 Samuel", chapters: 31, testament: "ot" },
    { slug: "2-samuel", name: "2 Samuel", chapters: 24, testament: "ot" },
    { slug: "1-kings", name: "1 Kings", chapters: 22, testament: "ot" },
    { slug: "2-kings", name: "2 Kings", chapters: 25, testament: "ot" },
    { slug: "1-chronicles", name: "1 Chronicles", chapters: 29, testament: "ot" },
    { slug: "2-chronicles", name: "2 Chronicles", chapters: 36, testament: "ot" },
    { slug: "ezra", name: "Ezra", chapters: 10, testament: "ot" },
    { slug: "nehemiah", name: "Nehemiah", chapters: 13, testament: "ot" },
    { slug: "esther", name: "Esther", chapters: 10, testament: "ot" },
    { slug: "job", name: "Job", chapters: 42, testament: "ot" },
    { slug: "psalms", name: "Psalms", chapters: 150, testament: "ot" },
    { slug: "proverbs", name: "Proverbs", chapters: 31, testament: "ot" },
    { slug: "ecclesiastes", name: "Ecclesiastes", chapters: 12, testament: "ot" },
    { slug: "song-of-solomon", name: "Song of Solomon", chapters: 8, testament: "ot" },
    { slug: "isaiah", name: "Isaiah", chapters: 66, testament: "ot" },
    { slug: "jeremiah", name: "Jeremiah", chapters: 52, testament: "ot" },
    { slug: "lamentations", name: "Lamentations", chapters: 5, testament: "ot" },
    { slug: "ezekiel", name: "Ezekiel", chapters: 48, testament: "ot" },
    { slug: "daniel", name: "Daniel", chapters: 12, testament: "ot" },
    { slug: "hosea", name: "Hosea", chapters: 14, testament: "ot" },
    { slug: "joel", name: "Joel", chapters: 3, testament: "ot" },
    { slug: "amos", name: "Amos", chapters: 9, testament: "ot" },
    { slug: "obadiah", name: "Obadiah", chapters: 1, testament: "ot" },
    { slug: "jonah", name: "Jonah", chapters: 4, testament: "ot" },
    { slug: "micah", name: "Micah", chapters: 7, testament: "ot" },
    { slug: "nahum", name: "Nahum", chapters: 3, testament: "ot" },
    { slug: "habakkuk", name: "Habakkuk", chapters: 3, testament: "ot" },
    { slug: "zephaniah", name: "Zephaniah", chapters: 3, testament: "ot" },
    { slug: "haggai", name: "Haggai", chapters: 2, testament: "ot" },
    { slug: "zechariah", name: "Zechariah", chapters: 14, testament: "ot" },
    { slug: "malachi", name: "Malachi", chapters: 4, testament: "ot" },
    { slug: "matthew", name: "Matthew", chapters: 28, testament: "nt" },
    { slug: "mark", name: "Mark", chapters: 16, testament: "nt" },
    { slug: "luke", name: "Luke", chapters: 24, testament: "nt" },
    { slug: "john", name: "John", chapters: 21, testament: "nt" },
    { slug: "acts", name: "Acts", chapters: 28, testament: "nt" },
    { slug: "romans", name: "Romans", chapters: 16, testament: "nt" },
    { slug: "1-corinthians", name: "1 Corinthians", chapters: 16, testament: "nt" },
    { slug: "2-corinthians", name: "2 Corinthians", chapters: 13, testament: "nt" },
    { slug: "galatians", name: "Galatians", chapters: 6, testament: "nt" },
    { slug: "ephesians", name: "Ephesians", chapters: 6, testament: "nt" },
    { slug: "philippians", name: "Philippians", chapters: 4, testament: "nt" },
    { slug: "colossians", name: "Colossians", chapters: 4, testament: "nt" },
    { slug: "1-thessalonians", name: "1 Thessalonians", chapters: 5, testament: "nt" },
    { slug: "2-thessalonians", name: "2 Thessalonians", chapters: 3, testament: "nt" },
    { slug: "1-timothy", name: "1 Timothy", chapters: 6, testament: "nt" },
    { slug: "2-timothy", name: "2 Timothy", chapters: 4, testament: "nt" },
    { slug: "titus", name: "Titus", chapters: 3, testament: "nt" },
    { slug: "philemon", name: "Philemon", chapters: 1, testament: "nt" },
    { slug: "hebrews", name: "Hebrews", chapters: 13, testament: "nt" },
    { slug: "james", name: "James", chapters: 5, testament: "nt" },
    { slug: "1-peter", name: "1 Peter", chapters: 5, testament: "nt" },
    { slug: "2-peter", name: "2 Peter", chapters: 3, testament: "nt" },
    { slug: "1-john", name: "1 John", chapters: 5, testament: "nt" },
    { slug: "2-john", name: "2 John", chapters: 1, testament: "nt" },
    { slug: "3-john", name: "3 John", chapters: 1, testament: "nt" },
    { slug: "jude", name: "Jude", chapters: 1, testament: "nt" },
    { slug: "revelation", name: "Revelation", chapters: 22, testament: "nt" }
  ];

  var bookSelect = document.getElementById("bible-book");
  var chapterSelect = document.getElementById("bible-chapter");
  var chapterGrid = document.getElementById("bible-chapter-grid");
  var versesEl = document.getElementById("bible-verses");
  var statusEl = document.getElementById("bible-status");
  var titleEl = document.getElementById("bible-passage-title");
  var prevBtn = document.getElementById("bible-prev-ch");
  var nextBtn = document.getElementById("bible-next-ch");

  var currentSlug = "genesis";
  var currentChapter = 1;
  var loadToken = 0;
  var hasLoaded = false;

  function findBook(slug) {
    return BIBLE_BOOKS.find(function (b) {
      return b.slug === slug;
    });
  }

  function cleanVerseText(text) {
    var noteAt = text.search(/\d+\.\d+\s/);
    if (noteAt > 8) return text.slice(0, noteAt).trim();
    return text.trim();
  }

  function setStatus(message) {
    if (statusEl) statusEl.textContent = message || "";
  }

  function updateHash(slug, chapter, replace) {
    var path = "#bible/" + slug + "/" + chapter;
    var state = { panel: "bible", book: slug, chapter: chapter };
    if (replace) {
      history.replaceState(state, "", path);
    } else {
      history.pushState(state, "", path);
    }
  }

  function fillChapterOptions(book) {
    if (!chapterSelect) return;
    chapterSelect.innerHTML = "";
    for (var c = 1; c <= book.chapters; c += 1) {
      var opt = document.createElement("option");
      opt.value = String(c);
      opt.textContent = String(c);
      chapterSelect.appendChild(opt);
    }
  }

  function fillChapterGrid(book) {
    if (!chapterGrid) return;
    chapterGrid.innerHTML = "";
    if (book.chapters > 50) {
      chapterGrid.hidden = true;
      return;
    }
    chapterGrid.hidden = false;
    for (var c = 1; c <= book.chapters; c += 1) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bible-chapter-pill";
      btn.textContent = String(c);
      btn.setAttribute("aria-label", "Chapter " + c);
      if (c === currentChapter) btn.classList.add("is-active");
      (function (chapterNum) {
        btn.addEventListener("click", function () {
          loadChapter(currentSlug, chapterNum, true);
        });
      })(c);
      chapterGrid.appendChild(btn);
    }
  }

  function syncChapterUi() {
    if (chapterSelect) chapterSelect.value = String(currentChapter);
    if (chapterGrid) {
      chapterGrid.querySelectorAll(".bible-chapter-pill").forEach(function (btn) {
        var num = parseInt(btn.textContent, 10);
        btn.classList.toggle("is-active", num === currentChapter);
      });
    }
  }

  function updateNavButtons() {
    var book = findBook(currentSlug);
    if (!book || !prevBtn || !nextBtn) return;
    var bookIndex = BIBLE_BOOKS.indexOf(book);
    prevBtn.disabled = bookIndex === 0 && currentChapter <= 1;
    nextBtn.disabled = bookIndex === BIBLE_BOOKS.length - 1 && currentChapter >= book.chapters;
  }

  function loadChapter(slug, chapter, pushHistory) {
    var book = findBook(slug);
    if (!book) return;
    var ch = Math.max(1, Math.min(book.chapters, parseInt(chapter, 10) || 1));

    currentSlug = book.slug;
    currentChapter = ch;

    if (bookSelect) bookSelect.value = book.slug;
    fillChapterOptions(book);
    fillChapterGrid(book);
    syncChapterUi();
    updateNavButtons();

    if (titleEl) titleEl.textContent = book.name + " " + ch;
    if (versesEl) versesEl.innerHTML = "";
    setStatus("Loading " + book.name + " " + ch + "…");

    if (pushHistory) updateHash(book.slug, ch, false);

    var token = ++loadToken;
    var url = API_BASE + "/" + encodeURIComponent(book.slug) + "/chapters/" + ch + ".json";

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Could not load chapter");
        return res.json();
      })
      .then(function (payload) {
        if (token !== loadToken) return;
        var rows = payload && payload.data ? payload.data : [];
        var seen = {};
        var verses = [];

        rows.forEach(function (row) {
          var v = parseInt(row.verse, 10);
          if (!v || seen[v]) return;
          seen[v] = true;
          verses.push({ verse: v, text: cleanVerseText(row.text) });
        });

        verses.sort(function (a, b) {
          return a.verse - b.verse;
        });

        if (!versesEl) return;
        versesEl.innerHTML = "";

        if (!verses.length) {
          setStatus("No verses found for this chapter. Check your internet connection and try again.");
          return;
        }

        verses.forEach(function (item) {
          var p = document.createElement("p");
          p.className = "bible-verse";
          p.innerHTML =
            '<sup class="bible-verse-num">' +
            item.verse +
            '</sup><span class="bible-verse-text">' +
            escapeHtml(item.text) +
            "</span>";
          versesEl.appendChild(p);
        });

        setStatus(book.name + " " + ch + " · " + verses.length + " verses · King James Version");
        versesEl.scrollTop = 0;
      })
      .catch(function () {
        if (token !== loadToken) return;
        setStatus("Unable to load this chapter. Please connect to the internet and try again.");
      });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stepChapter(delta) {
    var book = findBook(currentSlug);
    if (!book) return;
    var nextCh = currentChapter + delta;
    if (nextCh >= 1 && nextCh <= book.chapters) {
      loadChapter(currentSlug, nextCh, true);
      return;
    }
    var bookIndex = BIBLE_BOOKS.indexOf(book);
    if (delta < 0 && nextCh < 1 && bookIndex > 0) {
      var prevBook = BIBLE_BOOKS[bookIndex - 1];
      loadChapter(prevBook.slug, prevBook.chapters, true);
      return;
    }
    if (delta > 0 && nextCh > book.chapters && bookIndex < BIBLE_BOOKS.length - 1) {
      loadChapter(BIBLE_BOOKS[bookIndex + 1].slug, 1, true);
    }
  }

  function initBookSelect() {
    if (!bookSelect) return;

    ["ot", "nt"].forEach(function (testament) {
      var group = document.createElement("optgroup");
      group.label = testament === "ot" ? "Old Testament" : "New Testament";
      BIBLE_BOOKS.filter(function (b) {
        return b.testament === testament;
      }).forEach(function (book) {
        var opt = document.createElement("option");
        opt.value = book.slug;
        opt.textContent = book.name;
        group.appendChild(opt);
      });
      bookSelect.appendChild(group);
    });

    bookSelect.addEventListener("change", function () {
      var book = findBook(bookSelect.value);
      if (book) loadChapter(book.slug, 1, true);
    });
  }

  function primeBookUi(slug, chapter) {
    var book = findBook(slug) || BIBLE_BOOKS[0];
    currentSlug = book.slug;
    currentChapter = Math.max(1, Math.min(book.chapters, parseInt(chapter, 10) || 1));
    if (bookSelect) bookSelect.value = book.slug;
    fillChapterOptions(book);
    fillChapterGrid(book);
    syncChapterUi();
    updateNavButtons();
    if (titleEl) titleEl.textContent = book.name + " " + currentChapter;
  }

  function init() {
    if (!bookSelect || !versesEl) return;

    initBookSelect();
    primeBookUi("genesis", 1);

    if (chapterSelect) {
      chapterSelect.addEventListener("change", function () {
        loadChapter(currentSlug, parseInt(chapterSelect.value, 10), true);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { stepChapter(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stepChapter(1); });
  }

  window.LCBBC_Bible = {
    ensureReady: function () {
      if (!hasLoaded) {
        hasLoaded = true;
        loadChapter(currentSlug, currentChapter, false);
      }
    },
    goTo: function (slug, chapter) {
      hasLoaded = true;
      var book = slug ? findBook(slug) : findBook(currentSlug);
      if (!book) book = BIBLE_BOOKS[0];
      loadChapter(book.slug, chapter || 1, true);
    },
    handlePopState: function (slug, chapter) {
      hasLoaded = true;
      if (slug && findBook(slug)) {
        loadChapter(slug, chapter || 1, false);
      }
    }
  };

  init();
})();
