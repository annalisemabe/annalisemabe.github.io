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
var $lp = $('.loading-progress');
var progress = 0;
var fakeLoaderInterval = window.setInterval(function() {
  progress = progress + getRandomArbitrary(10, 25);
  $lp.css('transform', 'translateX(' + progress + '%)');
  if (progress >= 75) window.clearInterval(fakeLoaderInterval);
}, getRandomArbitrary(100, 500));

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

Papa.parse('https://docs.google.com/spreadsheets/d/1tPZrJaXlCi9LtwP1peFM_Yu17LYZe2NX_2tOnUuwRik/pub?output=csv', {
  download: true,
  header: true,
  complete: function(data) {
    var pubs = {};
    var html = '';
    
    // // finish loading animation
    window.clearInterval(fakeLoaderInterval);
    $lp.css('transform', 'translateX(100%)');
    setTimeout(function () {
      $('.loading').css('transform', 'translateY(calc(100% + 10px))');
    }, 400);

    const parsedData = data.data.reduce((mem, item) => {
      Object.keys(item).forEach(key => {
        if (!item[key]) return
        mem[key] ? mem[key].push(item[key]) : mem[key] = [item[key]]
      })
      return mem
    }, {})

    // general
    parsedData.general.forEach(function(item) {
      $('.title').text(item['Website Title']);
      item.Tagline.length && $('.tagline').text(item.Tagline);
    });

    // home
    parsedData.home.forEach(function(item) {
      $('.profile-img').attr('src', item['Image Link']);
      $('.about-me').html(item['About Me Text'].length ? '<p>' + item['About Me Text'] + '</p>' : '');
    });

    // publications page
    parsedData.publications.forEach(function(item) {
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
    parsedData.contact.forEach(function(item) {
      var html = '';
      html += '<p>' + item['Contact Text'] + '</p>';
      html += item['Email'] ? '<p>Email: <a href="mailto:' + item['Email'] + '">' + item['Email'] + '</a></p>' : '';
      html += item['Twitter Handle'] ? '<p>Twitter: <a href="' + item['Twitter Link'] + '">' + item['Twitter Handle'] + '</a>' : '';
      html += item['Instagram Handle'] ? '<p>Instagram: <a href="' + item['Instagram Link'] + '">' + item['Instagram Handle'] + '</a>' : ''
      $('[data-page-name="contact"]').html(html);
    });
  },
  simpleSheet: false
});
