(function () {
  var gallery = document.querySelector('.gallery');
  if (!gallery) return;

  var tiles = Array.prototype.slice.call(gallery.querySelectorAll('.tile'));

  // Masonry: place each tile in the currently shortest column, so the
  // numbered order reads left to right like the old Squarespace grid.
  function columnCount() {
    var w = window.innerWidth;
    if (w > 1200) return 6;
    if (w > 900) return 4;
    if (w > 700) return 3;
    return 2;
  }

  function layout() {
    var cols = columnCount();
    var gap = parseFloat(getComputedStyle(gallery).getPropertyValue('--gap')) || 6;
    var style = getComputedStyle(gallery);
    var inner = gallery.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    var colWidth = (inner - gap * (cols - 1)) / cols;
    var heights = [];
    for (var c = 0; c < cols; c++) heights.push(0);

    tiles.forEach(function (tile) {
      var img = tile.querySelector('img');
      var ratio = img.getAttribute('height') / img.getAttribute('width');
      var col = heights.indexOf(Math.min.apply(null, heights));
      tile.style.width = colWidth + 'px';
      tile.style.left = parseFloat(style.paddingLeft) + col * (colWidth + gap) + 'px';
      tile.style.top = heights[col] + 'px';
      heights[col] += colWidth * ratio + gap;
    });

    gallery.style.height = Math.max.apply(null, heights) + parseFloat(style.paddingBottom) + 'px';
  }

  gallery.classList.add('is-masonry');
  layout();
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 100);
  });

  // Lightbox
  var dialog = document.querySelector('.lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var lbImg = dialog.querySelector('img');
  var lbCount = dialog.querySelector('.lb-count');
  var current = 0;

  function show(i) {
    current = (i + tiles.length) % tiles.length;
    var src = tiles[current].querySelector('img');
    lbImg.src = tiles[current].getAttribute('href');
    lbImg.alt = src.alt;
    lbCount.textContent = (current + 1) + ' / ' + tiles.length;
    // Warm the cache for the neighbours so next/previous feels instant.
    [current - 1, current + 1].forEach(function (n) {
      new Image().src = tiles[(n + tiles.length) % tiles.length].getAttribute('href');
    });
  }

  tiles.forEach(function (tile, i) {
    tile.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });

  // Clicking the empty area around the image closes it; Esc is handled
  // natively by <dialog>.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Basic swipe support on touch screens.
  var startX = null;
  dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  dialog.addEventListener('close', function () {
    tiles[current].focus();
  });
})();
