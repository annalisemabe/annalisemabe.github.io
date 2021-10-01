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
  complete: function(res) {
    var pubs = {};
    var html = '';
    
    // // finish loading animation
    window.clearInterval(fakeLoaderInterval);
    $lp.css('transform', 'translateX(100%)');
    setTimeout(function () {
      $('.loading').css('transform', 'translateY(calc(100% + 10px))');
    }, 400);

    const parsedData = res.data.reduce((mem, item) => {
      Object.keys(item).forEach(key => {
        if (!item[key]) return
        mem[key] ? mem[key].push(item[key]) : mem[key] = [item[key]]
      })
      return mem
    }, {})

    // general
    $('.title').text(parsedData['Website Title']);
    parsedData.Tagline.length && $('.tagline').text(parsedData.Tagline);

    // home
    $('.profile-img').attr('src', parsedData['Image Link']);
    $('.about-me').html(parsedData['About Me Text'].length ? '<p>' + parsedData['About Me Text'] + '</p>' : '');

    // publications page
    parsedData.Publication.forEach(function(pub, i) {
      if (!pubs[parsedData.Category[i]]) {
        pubs[parsedData.Category[i]] = [];
      }
      pubs[parsedData.Category[i]].push({ link: parsedData.Link[i], publication: pub });
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
    var html = '';
    html += parsedData['Contact Text'] ? '<p>' + parsedData['Contact Text'] + '</p>' : '';
    html += parsedData['Email'] ? '<p>Email: <a href="mailto:' + parsedData['Email'] + '">' + parsedData['Email'] + '</a></p>' : '';
    html += parsedData['Twitter Handle'] ? '<p>Twitter: <a href="' + parsedData['Twitter Link'] + '">' + parsedData['Twitter Handle'] + '</a>' : '';
    html += parsedData['Instagram Handle'] ? '<p>Instagram: <a href="' + parsedData['Instagram Link'] + '">' + parsedData['Instagram Handle'] + '</a>' : ''
    $('[data-page-name="contact"]').html(html);
  },
  simpleSheet: false
});
