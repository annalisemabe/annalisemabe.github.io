var MAX_LOADER_COUNT = 6;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// super simple router - go to page specified in hash, otherwise go to "default"
var route = window.location.hash.replace('#', '');
function router (route) {
  var pageName = route ? route : $('.default.page').attr('data-page-name');
  var $page = $('[data-page-name="' + pageName + '"]');
  $('.page').css('display', 'none');
  $('[data-page]').removeClass('active');
  $('[data-page="' + pageName + '"]').addClass('active');
  $page.css('display', 'block');
  if (route) window.location.hash = route;
}
router(route);

// fake loader
function fakeLoader () {
  var counter = 0;
  var fakeLoaderInterval = window.setInterval(function() {
    $lp = $('.loading-progress');
    $lp.addClass('loading-state-' + (counter + 1));
    $lp.removeClass('loading-state-' + counter);
    counter++;
    if (counter === MAX_LOADER_COUNT) window.clearInterval(fakeLoaderInterval);
  }, getRandomArbitrary(200, 500));
}
fakeLoader();

// navigation
$('.main-nav li a').on('click', function(e) {
  var $this = $(e.currentTarget);
  var route = $this.attr('data-page');

  $('.main-nav li a').removeClass('active');
  $this.addClass('active');
  router(route);

  return false;
});

// https://docs.google.com/spreadsheets/d/1tPZrJaXlCi9LtwP1peFM_Yu17LYZe2NX_2tOnUuwRik/pubhtml
Tabletop.init({
  key: '1tPZrJaXlCi9LtwP1peFM_Yu17LYZe2NX_2tOnUuwRik',
  callback: function(data, tabletop) {
    var pubs = {};
    var html = '';
    
    $('.loading-progress').removeClass('loading-state-' + MAX_LOADER_COUNT);
    $('.loading-progress').addClass('loading-state-complete-1');
    setTimeout(function() {
      $('.loading-progress').addClass('loading-state-complete-3');
      $('.loading').addClass('loading-state-complete-3');
      setTimeout(function() { $('[class^="loading-state"]').remove() }, 750)
    }, 750);

    // general
    data.general.elements.forEach(function(item) {
      $('.title').text(item['Website Title']);
      item.Tagline.length && $('.tagline').text(item.Tagline);
    });

    // home
    data.home.elements.forEach(function(item) {
      $('.profile-img').attr('src', item['Image Link']);
      $('.about-me').html(item['About Me Text'].length ? '<p>' + item['About Me Text'] + '</p>' : '');
    });

    // publications page
    data.publications.elements.forEach(function(item) {
      if (!pubs[item.Category]) {
        pubs[item.Category] = [];
      }
      pubs[item.Category].push({ link: item.Link, publication: item.Publication });
    });

    for (var pub in pubs) {
      html += '<h2 class="subtitle">' + pub + '</h2>';
      pubs[pub].forEach(function(item) {
        if (item.link) {
          html += '<p><a href="' + item.link + '" target="_blank">' + item.publication + '</a></p>';
        } else {
          html += '<p>' + item.publication + '</p>';
        }
      });
    }
    $('[data-page-name="publications"]').html(html);

    // contact page
    data.contact.elements.forEach(function(item) {
      var html = '';
      html += '<p>' + item['Contact Text'] + '</p>';
      html += '<p>Email: <a href="mailto:' + item['Email'] + '">' + item['Email'] + '</a></p>';
      html += '<p>Twitter: <a href="' + item['Twitter Link'] + '">' + item['Twitter Handle'] + '</a>';
      html += '<p>Instagram: <a href="' + item['Instagram Link'] + '">' + item['Instagram Handle'] + '</a>';
      $('[data-page-name="contact"]').html(html);
    });
  },
  simpleSheet: false
});
