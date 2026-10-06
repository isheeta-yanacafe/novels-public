// 読書ページの小さな機能：続きから読む／段落番号の表示切り替え
// 記録はこのブラウザの中だけ（localStorage）。使えない環境では何もしない。
(function () {
  function get(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function set(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 保存できなくても読める */ }
  }

  // 段落番号
  var NUM_KEY = "novels:show-num";
  var toggle = document.querySelector(".num-toggle");
  function applyNum(on) {
    document.body.classList.toggle("show-num", on);
    if (toggle) toggle.setAttribute("aria-pressed", on ? "true" : "false");
  }
  applyNum(get(NUM_KEY) === "1");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var on = !document.body.classList.contains("show-num");
      applyNum(on);
      set(NUM_KEY, on ? "1" : "0");
    });
  }

  // 章を開いたら「最後に開いた章」として記録
  var reading = document.querySelector("main.reading");
  if (reading) {
    var slug = reading.getAttribute("data-slug");
    set("novels:" + slug + ":last", reading.getAttribute("data-chapter") + "|" + reading.getAttribute("data-label"));
  }

  // 目次ページに「続きから読む」を出す
  var toc = document.querySelector("main.toc");
  if (toc) {
    var saved = get("novels:" + toc.getAttribute("data-slug") + ":last");
    if (saved) {
      var parts = saved.split("|");
      var n = parseInt(parts[0], 10);
      if (n > 0) {
        var file = (n < 10 ? "0" : "") + n + ".html";
        var btn = toc.querySelector(".btn.resume");
        btn.href = file;
        btn.textContent = "続きから読む（" + (parts[1] || ("第" + n + "章")) + "）";
        btn.hidden = false;
        var link = toc.querySelector('.toc-part a[href="' + file + '"]');
        if (link) link.classList.add("current");
      }
    }
  }
})();
