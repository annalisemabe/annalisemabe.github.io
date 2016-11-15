var route = window.location.hash.replace('#', '');

// super simple router - go to page specified in hash, otherwise go to "default"
function router (route) {
  var pageName = route ? route : $('.default.page').attr('data-page-name');
  console.log(pageName)
  var $page = $('[data-page-name="' + pageName + '"]');
  console.log($page.html())
  $('.page').css('display', 'none');
  $('[data-page]').removeClass('active');
  $('[data-page="' + pageName + '"]').addClass('active');
  $page.css('display', 'block');
  if (route) window.location.hash = route;
}

router(route);

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

    // remove loading screen
    $('.loading').fadeOut();

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
    $('[data-page-name="publications"').html(html);

    // contact page
    data.contact.elements.forEach(function(item) {
      var html = '';
      html += '<p>' + item['Contact Text'] + '</p>';
      html += '<p>Email: <a href="mailto:' + item['Email'] + '">' + item['Email'] + '</a></p>';
      html += '<p>Twitter: <a href="' + item['Twitter Link'] + '">' + item['Twitter Handle'] + '</a>';
      html += '<p>Instagram: <a href="' + item['Instagram Link'] + '">' + item['Instagram Handle'] + '</a>';
      $('[data-page-name="contact"').html(html);
    });
  },
  simpleSheet: false
});
