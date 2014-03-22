(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var notify = require('../util/notify')
	, config = require('./config')
	, connection = require('../util/connection')
	, createFileWithContents = require('../io/createFileWithContents')
	, getFileContents = require('../io/getFileContents')
	, doesFileExist = require('../io/doesFileExist')
	, toJson = require('./xmlToJson')
	, downloadExternalFile = require('../io/downloadExternalFile')
	, getFileList = require('../io/getFileList')
	, removeFile = require('../io/removeFile');

function getFeed(id) {
	return new Promise(function (resolve, reject) {
		get(id).then(function (fileentry) {
			var filename = fileentry.name || fileentry.target.localURL.split('/').pop();
			getFileContents(filename).then(function (contents) {
				var obj = (JSON.parse(contents.target._result));
				getImages(obj).then(function () {
					removeOrphanedImages().then(function () {
						resolve(contents);
					}, reject);
				}, reject);
			}, reject)
		}, reject)
	})
}

function getImages(feedObject) {
	return new Promise(function (resolve, reject) {
  	var i = 0
  		, items = feedObject.story.filter(function (element) {return element.image !== undefined}).length
  		, prevPromise = Promise.resolve();

	  	feedObject.story.forEach(function(obj) { 
		    if (obj.image) {
		    	prevPromise = prevPromise.then(function() {
			      return downloadExternalFile(obj.image);
			    }).then(function(data) {
			      i += 1;
			      if (i === items) {
			      	resolve(data);
			      }
			    }).catch(reject);
		    }
		  });
  })
}

function getFeedFromConfig(id) {
	var feeds = [];
	config.menu.forEach(function (item) {
		if (item.feeds) {
			item.feeds.forEach(function (el) {
				feeds.push(el);
			})
		}
	})
	return feeds[id];
}

function getFilenameFromFeed(feed) {
	return feed.filename || feed.url.split('/').pop().split('.').shift() + '.json';
}

function getFilenameFromId(id) {
	var feed = getFeedFromConfig(id);
	return getFilenameFromFeed(feed)
}

function get(id) {
	// resolves when feed is downloaded
	return new Promise(function (resolve, reject) {
		var feed = getFeedFromConfig(id)
			, url = feed.url
			, filename = feed.filename || url.split('/').pop().split('.').shift() + '.json';

		if (navigator.connection.type !== 'none') {
			$.ajax({
				url: url
				, dataType: 'xml'
			}).then(function (res) {
				var obj = toJson(res);

				doesFileExist(filename).then(function () {
					//file exists
					getFileContents(filename).then(function (contents) {
						var json = JSON.stringify(contents.target._result);
						if (json.lastBuildDate === obj.lastBuildDate) {
							//no updates since last build
							resolve(contents)
						} else {
							//file is not current
							createFileWithContents(filename, JSON.stringify(obj)).then(resolve, reject);
						}
					}, reject) // file was created but doesn't exist? unlikely
				}, function () {
					//file does not exist
					createFileWithContents(filename, JSON.stringify(obj)).then(resolve, reject);
				});
			}, reject);
		} else {
			doesFileExist(filename).then(resolve, reject)
		}
	})
}

function removeOrphanedImages() {
	return new Promise(function (resolve, reject) {
		var images = ['image-unavailable_605x328.png'];
		getFileList().then(function (response) {
			var json = response.filter(function (element) {return element.name.split('.').pop() === 'json'})
				, imageFiles = response.filter(function (element) {
						var ext = element.name.split('.').pop()
						return ext === 'jpg' || ext === 'png' || ext === 'jpeg'
					})
				, filenames = json.map(function (element) {return element.name});

			Promise.all(
	    	filenames.map(getFileContents)
	  	).then(function (res) {
	  		var imagesToRemove = [];
	  		res.forEach(function (el) {
	  			var obj = JSON.parse(el.target.result)
	  			obj.story.forEach(function (ele) {
	  				if (ele.image && images.indexOf(ele.image.split('/').pop()) === -1) {
	  					images.push(ele.image.split('/').pop())
	  				}
	  			})
	  		})
	  		imagesToRemove = imageFiles.filter(function(val) {
				  return images.indexOf(val.name) === -1;
				});
	  		Promise.all(imagesToRemove.map(removeFile)).then(resolve, reject)
	  	});
		}, reject)
	})
}

function removeFeed(id) {
	return new Promise(function (resolve, reject) {
		var filename = getFilenameFromId(id);
			
		doesFileExist(filename).then(function (fileentry) {
			removeFile(fileentry).then(function () {
				removeOrphanedImages().then(resolve, reject);
			}, reject)
		}, reject);
	})
}

module.exports = {
	get: getFeed
	, getFilenameFromId: getFilenameFromId
	, getFilenameFromFeed: getFilenameFromFeed
	, removeFeed: removeFeed
};
},{"../io/createFileWithContents":13,"../io/doesFileExist":14,"../io/downloadExternalFile":15,"../io/getFileContents":18,"../io/getFileList":20,"../io/removeFile":25,"../util/connection":27,"../util/notify":29,"./config":2,"./xmlToJson":9}],2:[function(require,module,exports){
module.exports = {
	fs: void 0
	, folder: 'com.ceip.carnegie'
	, storyFontSize: 1.1
	, menuMessage: 'Not yet downloaded'
	, missingImage: 'http://m.ceip.org/img/appsupport/image-unavailable_605x328.png'
	, missingImageRef: void 0
	, menu: [{
			title: 'Analysis'
			, sub: 'Read Offline'
			, feeds: [{
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-english-dc.xml'
				, name: 'Latest Analysis'
				, required: true
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-Top5.xml'
				, name: 'Most Popular'
			}]
		}, {
			title: 'Languages'
			, sub: 'Read Offline'
			, feeds: [{
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-english.xml'
				, name: 'English'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-russian.xml'
				, name: 'Русский'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-chinese.xml'
				, name: '中文'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-arabic.xml'
				, name: 'عربي'
				, dir: 'rtl'
			}]
		}, {
			title: 'Global Centers'
			, sub: 'Read Offline'
			, feeds: [{
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-beijing.xml'
				, name: 'Beijing'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-beirut.xml'
				, name: 'Beirut'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-brussels.xml'
				, name: 'Brussels'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-moscow.xml'
				, name: 'Moscow'
			}, {
				url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-english-dc.xml'
				, name: 'Washington'
				, required: true
			}]
		}, {
			title: 'Blogs'
			, sub: 'From m.ceip.org'
			, links: [{
				url: 'http://m.ceip.org/moscow/eurasiaoutlook/'
				, name: 'Eurasia Outlook'
			}, {
				url: 'http://m.ceip.org/sada/'
				, name: 'Sada'
			}, {
				url: 'http://m.ceip.org/brussels/strategiceurope'
				, name: 'Strategic Europe'
			}]
		}, {
			title: 'Global Resources'
			, links: [{
				url: 'http://m.ceip.org/issues/'
				, name: 'Issues'
			}, {
				url: 'http://m.ceip.org/regions/'
				, name: 'Regions'
			}, {
				url: 'http://m.ceip.org/experts/'
				, name: 'Experts'
			}, {
				url: 'http://m.ceip.org/publications/'
				, name: 'Publications'
			}, {
				url: 'http://m.ceip.org/events/'
				, name: 'Events'
			}]
		}, {
			title: 'Explore'
			, links: [{
				url: 'http://m.ceip.org/about/'
				, name: 'About Us'
			}, {
				url: 'http://m.ceip.org/support/&lang=en'
				, name: 'Support Carnegie'
			}, {
				url: 'http://m.ceip.org/about/&fa=contact'
				, name: 'Help Desk'
			}, {
				url: 'http://m.ceip.org/about/&lang=en&fa=privacy'
				, name: 'Privacy Statement'
			}]
		}
	]
};
},{}],3:[function(require,module,exports){
module.exports = function () {
	var config = require('./config')
		, notify = require('../util/notify')
		, doesFileExist = require('../io/doesFileExist')
		, downloadExternalFile = require('../io/downloadExternalFile');

	return new Promise(function (resolve, reject) {
		function init(response) {
			var ref = response.toURL();

			//config.fs = ref.substr(0, ref.lastIndexOf('/') + 1);
			config.missingImageRef = response;

			resolve(response);
		}

		doesFileExist(config.missingImage.split('/').pop()).then(init, function (reason) {
			if (navigator.connection.type !== 'none') {
				downloadExternalFile(config.missingImage).then(init, reject);
			} else {
				reject(reason)
			}
		})
	})
}
},{"../io/doesFileExist":14,"../io/downloadExternalFile":15,"../util/notify":29,"./config":2}],4:[function(require,module,exports){
var story = require('./story');

$(document)
	.on('click', 'header .show-menu', function () {
		$('header').addClass('stay');
		if ($('section.menu').hasClass('active')) {
			showStoryList();
		} else {
			showMenu();
		}
	})
	.on('click', 'header .story .back', showStoryList)
	.on('click', 'header .story .btn-group .previous', function () {
		story.previous();
	})
	.on('click', 'header .story .btn-group .next', function () {
		story.next();
	});

function show(sel) {
	var sels = ['.menu', '.story', '.story-list']
		, $h = $('header')
		, $sel = $h.find(sel).stop(true);

	sels.splice(sels.indexOf(sel), 1);

	sels.forEach(function (el, index) {
		var $el = $h.find(el);

		$el.stop(true).fadeOut('fast', function () {
			$el.removeClass('active')
		});
	});

	setTimeout(function () {
		$sel.addClass('active').fadeIn('fast')
	}, 300)
}

function showStoryList() {
	$('section.story').removeClass('active');
	$('section.story-list').addClass('active');
	$('section.menu').removeClass('active');
	$('footer.story-footer').removeClass('active');
	show('.story-list');
	story.hide();
}

function showMenu() {
	$('section.menu').addClass('active');
	show('.menu');
}

function showStory() {
	$('header').removeClass('stay');
	$('section.menu').removeClass('active');
	$('footer.story-footer').addClass('active');
	$('section.story').addClass('active');
	show('.story');
}

module.exports = {
	showStoryList: showStoryList
	, showMenu: showMenu
	, showStory: showStory
}
},{"./story":7}],5:[function(require,module,exports){
var config = require('../config')
	, access = require('../access')
	, header = require('./header')
	, storyList = require('./storyList')
	, doesFileExist = require('../../io/doesFileExist')
	, getFileContents = require('../../io/getFileContents')
	, primary = false;

(function init() {
	var menuFragment = $('<section/>', {
		addClass: 'menu'
	});

	config.menu.forEach(function (obj) {
		var feed = !!obj.feeds
		, list = $('<ul/>', {
				addClass: 'menu-items'
			})
		, title = $('<span/>', {
				addClass: 'title'
				, text: obj.title || ''
			})
		, sub = $('<span/>', {
				addClass: 'sub'
				, text: obj.sub || ''
			})
		, sectionHeader = $('<div/>', {
				addClass: 'section-header'
			}).append(title).append(sub);

		if (feed) {
			obj.feeds.forEach(function (el) {
				var label = $('<div/>', {
					addClass: 'label'
					, text: el.name
				})
				, sub = $('<div/>', {
					addClass: 'sub'
					, text: 'Not yet downloaded'
					, 'data-url': el.filename || el.url.split('/').pop().split('.').shift() + '.json'
				})
				, container = $('<div/>', {
						addClass: 'menu-item-box'
					}).append(label).append(sub)
				, box = $('<div/>', {
						addClass: el.required ? 'check required' : 'check'
					})
				, link = $('<a/>', {
					addClass: 'menu-link feed'
				})
				, hairline = $('<div/>', {
					addClass: 'hairline'
				})
				, item = $('<li/>', {
					addClass: 'menu-item'
				}).append(hairline).append(link.append(container).append(box))
				, filename = access.getFilenameFromFeed(el);

				if (el.required && !primary) {
					primary = item;
					item.addClass('active')
				}

				doesFileExist(filename).then(function () {
					getFileContents(filename).then(function (contents) {
						var obj = (JSON.parse(contents.target._result));
						update(filename, 'Updated: ' + obj.lastBuildDate);
						box.addClass('checked');
					})
				})

				list.append(item);
			})
		} else {
			obj.links.forEach(function (el) {
				var label = $('<div/>', {
					addClass: 'label link'
					, text: el.name
				})
				, container = $('<div/>', {
						addClass: 'menu-item-box'
					}).append(label)
				, link = $('<a/>', {
					addClass: 'menu-link link'
					, href: el.url
					, target: '_system'
				})
				, hairline = $('<div/>', {
					addClass: 'hairline'
				})
				, item = $('<li/>', {
					addClass: 'menu-item'
				}).append(hairline).append(link.append(container));

				list.append(item);
			})
		}

		menuFragment.append(sectionHeader).append(list);

	});

	$('section.menu').replaceWith(menuFragment);

	$('a.menu-link .check').on('click', function (e) {
		//download a feed
		var index = $('section.menu li').index($(this).closest('li'))
		e.stopPropagation();

		if ($(this).hasClass('checked') && $(this).hasClass('required') === false) {
			remove(index);
		} else {
			if (navigator.connection.type !== 'none') {
				get(index, true);
			}
		}
	})

	$('a.menu-link.feed').on('click', function (e) {
		e.preventDefault();

		if (navigator.connection.type !== 'none') {
			get($('section.menu li').index($(this).closest('li')));
		}

		$('section.menu li.active').removeClass('active');
		$(e.currentTarget).closest('li').addClass('active');
	})

	$('a.menu-link.link').on('click', function (e) {
		e.preventDefault();
		window.open(encodeURI($(e.currentTarget).prop('href')), '_blank', 'location=no, toolbar=yes');
		$('section.menu li.active').removeClass('active');
		$(e.currentTarget).closest('li').addClass('active');
	})

}());

function update(filename, date) {
	var items = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]');
	items.text(date);
	items.closest('li').find('.check').removeClass('loading').addClass('checked');
}

function get(id, loadOnly) {
	var filename = access.getFilenameFromId(id);
	$('section.menu .menu-item-box .sub[data-url="' + filename + '"]').closest('li').find('.check').addClass('loading');

	access.get(id).then(function (contents) {
		var obj = (JSON.parse(contents.target._result));

		update(filename, 'Updated: ' + obj.lastBuildDate);
		if (!loadOnly) {
			storyList.show(obj).then(function () {
        header.showStoryList();
			});
		}

	}, function (error) {
		console.log(error)
		notify.alert('an error occured')
	});
}

function remove(id) {
	var filename = access.getFilenameFromId(id)
		, item = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]').closest('li');

	access.removeFeed(id).then(function () {
		item.find('.check').removeClass('checked');
		item.find('.sub').text(config.menuMessage);
		if (item.hasClass('active')) {
			item.removeClass('active');
			primary.addClass('active');
			getFileContents(access.getFilenameFromId(0)).then(function (contents) {
				var obj = (JSON.parse(contents.target._result));
				storyList.show(obj);
			})
		}
	})
}

module.exports = {
	update: update
}
},{"../../io/doesFileExist":14,"../../io/getFileContents":18,"../access":1,"../config":2,"./header":4,"./storyList":8}],6:[function(require,module,exports){
module.exports = (function () {

	var images = [
		'footer-story-share-active.png'
		, 'footer-story-text-active.png'
		, 'header-btn-menu-menu-active.png'
		, 'header-btn-story-arrow-active.png'
		, 'header-btn-story-back-active.png'
		, 'header-btn-story-menu-active.png'
		, 'header-story.png'
		, 'checked.png'
		, 'unchecked.png'
	].forEach(function (element) {
		var img = new Image();
		img.src = './img/' + element;
	})
}());
},{}],7:[function(require,module,exports){
var config = require('../config')
	, access = require('../access')
	, notify = require('../../util/notify')
	, share = ['ios', 'android', 'win32nt'].indexOf(device.platform.toLowerCase()) > -1
	, browser = ['ios', 'android', 'blackberry 10', 'win32nt'].indexOf(device.platform.toLowerCase()) > -1
	, feedObj
	, index;

if (share && plugins && plugins.socialsharing) {
	$(document).on('click', 'footer.story-footer .share', function () {
		hideTextResize();
		if (typeof index !== 'undefined' && feedObj) {
				setTimeout(function () {
					window.plugins.socialsharing.share(
						'I\'m currently reading ' + feedObj.story[index].title,
				    feedObj.story[index].title,
				    feedObj.story[index].image || config.missingImage,
				    encodeURI(feedObj.story[index].link)
			    )
				}, 0)
		} else {
			notify.alert('Sorry, a problem occured trying to share this post')
		}
	})
} else {
	//remove footer & make story window taller, sharing not supported
	$('section.story .share').addClass('disabled');
}

if (browser) {
	$(document).on('click', 'section.story a', function (e) {
		var href = $(e.currentTarget).attr('href')
			, selector = '';
		if (href.substr(0, 1) === '#') {
			return
		} else if (href.substr(0, 6) === 'mailto') {
			e.preventDefault();
			window.open(encodeURI(href), '_system', '');
		} else {
			e.preventDefault();
			window.open(encodeURI(href), '_blank', 'location=no, toolbar=yes');
		}
	})
} else {
	// handle systems with no inapp browser, or don't...
}
/*
$(document).on('change', '#text-resize-input', function (e) {
	var val = parseFloat(e.currentTarget.value, 10);
	config.storyFontSize = val;
	setTimeout(function () {
		$('section.story').css('font-size', val + 'em');
	}, 0)
})*/

$(document).on('click', 'footer.story-footer .text', function () {
	$('.text-resize').toggleClass('active');
});

function hideTextResize() {
	$('.text-resize').removeClass('active');
}

var slider = document.getElementById('text-resize-input');
slider.onchange = function () {
	var val = parseFloat(slider.value, 10)
		, value = (slider.value - slider.min)/(slider.max - slider.min)

	config.storyFontSize = val;

	slider.style.backgroundImage = [
		'-webkit-gradient(',
		'linear, ',
		'left top, ',
		'right top, ',
		'color-stop(' + value + ', #007aff), ',
		'color-stop(' + value + ', #b8b7b8)',
		')'
	].join('');

	setTimeout(function () {
		$('section.story').css('font-size', val + 'em');
	}, 0)
};

function show(i, feed) {
	return new Promise(function (resolve, reject) {
		var obj = feedObj = feed || feedObj
			, storyObj = obj.story[i]
			, rtl = obj.title ? obj.title.toLowerCase().indexOf('arabic') > -1 : false
			, current = $('<div/>', {
					addClass: 'current'
				});

		index = i;
		$('section.story').toggleClass('rtl', !!rtl).prop('dir', rtl ? 'rtl' : 'ltr');

		createPage(storyObj).then(function (page) {
			current.append(page);
			$('section.story .current').replaceWith(current);

			createPreviousAndNext();

		  setTimeout(function () {
		  	resolve(200)
		  }, 0)
		})
	})
}

function createPrevious() {
	var previous = $('<div/>', {
				addClass: 'previous'
			})
		, $previous = $('section.story .previous');

	if (notFirst()) {
		createPage(feedObj.story[index - 1]).then(function (pageP) {
			previous.append(pageP);
			if ($previous.length) {
				$previous.replaceWith(previous);
			} else {
				$('section.story').append(previous);
			}
		})
	} else {
		$previous.empty()
	}
}

function createNext() {
	var next = $('<div/>', {
				addClass: 'next'
			})
		, $next = $('section.story .next');

	if (notLast()) {
		createPage(feedObj.story[index + 1]).then(function (pageN) {
			next.append(pageN);
			if ($next.length) {
				$next.replaceWith(next);
			} else {
				$('section.story').append(next);
			}
		})
	} else {
		$next.empty()
	}
}

function createPreviousAndNext() {
	createPrevious();
	createNext();
}

function createPage(storyObj) {
	return new Promise(function (resolve, reject) {
		var fs = config.fs.toURL()
			, path = fs + (fs.substr(-1) === '/' ? '' : '/')
			, image = storyObj.image ? path + storyObj.image.split('/').pop() : config.missingImageRef.toURL()
			, topBar = $('<div/>', {
				addClass: 'top-bar'
				, text: storyObj.docType
			})
			, storyTitle = $('<div/>', {
				addClass: 'story-title'
				, text: storyObj.title
			})
			, storyImage = $('<img>', {
				src: image
				, addClass: 'story-image'
			})
			, storyAuthor = $('<div/>', {
				addClass: 'story-author'
				, text: storyObj.author
			})
			, storyDate = $('<div/>', {
				addClass: 'story-date'
				, text: storyObj.pubDate
			})
			, storyMeta = $('<div/>', {
				addClass: 'story-meta'
			}).append(storyAuthor).append(storyDate)
			, storyText = $('<div/>', {
				addClass: 'story-text'
				, html: storyObj.description
			})
			, page = $('<div/>', {
				addClass: 'page'
			}).append(topBar).append(storyTitle).append(storyImage).append(storyMeta).append(storyText);

		storyImage.on('error', function (e) {
	    $(this).prop('src', config.missingImageRef.toURL());
	  })

		setTimeout(function () {
			resolve(page)
		}, 0)
	})
}

function notLast(id) {
	return id || index < feedObj.story.length - 1;
}

function notFirst(id) {
	return id || index > 0;
}

function next() {
	if (notLast()) {
		index += 1;
		var c = $('section.story .current')
			, n = $('section.story .next')
			, p = $('section.story .previous').remove();

		c.removeClass('current').addClass('previous');
		n.removeClass('next').addClass('current');
		createNext();
		update();
		//showAndUpdate(index);
	}
}

function previous() {
	if (notFirst()) {
		index -= 1;
		var c = $('section.story .current')
			, p = $('section.story .previous')
			, n = $('section.story .next').remove();

		c.removeClass('current').addClass('next');
		p.removeClass('previous').addClass('current');
		createPrevious();
		update();
	}
}

function update() {
	hideTextResize();
	$('section.story-list ul li .story-item.active').removeClass('active'); 
	$('section.story-list ul li .story-item').eq(index).addClass('active');

	setTimeout(function () {
		//$('section.story-list').scrollTop($('section.story-list .story-item.active').position().top);
		$('section.story .next').scrollTop(0);
		$('section.story .previous').scrollTop(0);
	}, 350)
}

function showAndUpdate(index) {
	show(index, null, true).then(function() {
		update();
	});
	//storyList.update(index);
}

module.exports = {
	show: show
	, next: next
	, previous: previous
	, hide: hideTextResize
}
},{"../../util/notify":29,"../access":1,"../config":2}],8:[function(require,module,exports){
var config = require('../config')
  , header = require('./header')
  , story = require('./story');

function show(feedObj) {
	return new Promise(function(resolve, reject) {
    var obj = feedObj.story
      , rtl = feedObj.title ? feedObj.title.toLowerCase().indexOf('arabic') > -1 : false
      , fs = config.fs.toURL()
      , path = fs + (fs.substr(-1) === '/' ? '' : '/')
      , topBar = $('<div/>', {
        addClass: 'top-bar'
        , text: 'Updated: ' + feedObj.lastBuildDate
      })
      , ul = $('<ul/>', {})
      , section = $('<section/>', {
        addClass: 'story-list'
        , dir: rtl ? 'rtl' : 'ltr'
      }).append(topBar).append(ul).toggleClass('rtl', rtl)
      , sent = false;

    obj.forEach(function (element) {
      var image = element.image ? path + element.image.split('/').pop() : config.missingImageRef.toURL()
        , storyTitle = $('<div/>', {
          addClass: 'story-title'
          , text: element.title
        })
        , storyAuthor = $('<div/>', {
          addClass: 'story-author'
          , text: element.author
        })
        , storyDate = $('<div/>', {
          addClass: 'story-date'
          , text: element.pubDate
        })
        , storyText = $('<div/>', {
          addClass: 'story-text'
        }).append(storyTitle).append(storyAuthor).append(storyDate)
        , storyImage = $('<img>', {
          src: image
          , addClass: 'story-image'
        })
        , hairline = $('<div/>', {
          addClass: 'hairline'
        })
        , storyItem = $('<div/>', {
          addClass: 'story-item'
        }).append(hairline).append(storyImage).append(storyText)
        , li = $('<li/>', {}).append(storyItem)

        ul.append(li);
    });

    $('.container section.story-list').replaceWith(section)

    $('.story-item').on('click', function (e) {
      var li = $(this).closest('li')
        , index = $('section.story-list ul li').index(li)
        , feed = sent ? void 0 : feedObj;

        $('.story-item.active').removeClass('active'); 
        $(this).addClass('active'); 
        story.show(index, feed).then(function () {
          header.showStory();
        })
        sent = true;
    });

    $('.story-image').on('error', function (e) {
      $(this).prop('src', config.missingImageRef.toURL());
    })
    setTimeout(function () {
      resolve(200);
    }, 0)
  })
};

module.exports = {
	show: show
}
},{"../config":2,"./header":4,"./story":7}],9:[function(require,module,exports){
module.exports = function (res) {
	var feedObject = {}
    , root = res.firstChild.firstChild
    , numberOfFeeds = root.childNodes.length - 2
    , nodesInFeed = root.childNodes[2].childNodes.length
    , i
    , j;

  feedObject.title = root.childNodes[0].textContent;
  feedObject.lastBuildDate = root.childNodes[1].textContent;
  feedObject.story = [];

  for (i = 0; i < numberOfFeeds; i += 1) {
      feedObject.story[i] = {};
      for (j = 0; j < root.childNodes[2 + i].childNodes.length; j += 1) {
          feedObject.story[i][root.childNodes[2 + i].childNodes[j].nodeName] =
              root.childNodes[2 + i].childNodes[j].textContent;
      }
  }

  return feedObject;
}
},{}],10:[function(require,module,exports){
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var connection = require('./util/connection');

module.exports = (function () {
		document.addEventListener('online', connection.online, false);
		document.addEventListener('offline', connection.offline, false);
		
    document.addEventListener('deviceready', appReady, false);

    function appReady() {
    	//setTimeout(function () {
				//require('./test');
				$(function () {
					require('./init');
				})
				setTimeout(function () {
					navigator.splashscreen.hide();
				}, 200)
    	//}, 6000)
      
    }
}());

},{"./init":11,"./util/connection":27}],11:[function(require,module,exports){
module.exports = (function () {
	var access = require('./app/access')
	, createDir = require('./io/createDir')
	, storyList = require('./app/ui/storyList')
	, notify = require('./util/notify')
	, header = require('./app/ui/header')
	, menu = require('./app/ui/menu')
	, doesFileExist = require('./io/doesFileExist')
	, getFileContents = require('./io/getFileContents')
	, downloadMissingImage = require('./app/downloadMissingImage')
	, preloadImages = require('./app/ui/preloadImages')
	, err = require('./util/err');
	
	createDir().then(function () {
		downloadMissingImage().then(function () {
			access.get(0).then(function (contents) {
				var obj = (JSON.parse(contents.target._result))
					, filename = access.getFilenameFromId(0);

				menu.update(filename, 'Updated: ' + obj.lastBuildDate);
				storyList.show(obj).then(function () {
					header.showStoryList();

					setTimeout(function () {
						$('.spinner').fadeOut(function () {
							$('.splash').fadeOut();
						});
					}, 100)
				})
			}, err);
		}, err)
	}, err)
}())
},{"./app/access":1,"./app/downloadMissingImage":3,"./app/ui/header":4,"./app/ui/menu":5,"./app/ui/preloadImages":6,"./app/ui/storyList":8,"./io/createDir":12,"./io/doesFileExist":14,"./io/getFileContents":18,"./util/err":28,"./util/notify":29}],12:[function(require,module,exports){
var getFileSystem = require('./getFileSystem')
	, getFile = require('./getFile')
	, makeDir = require('./makeDir')
	, notify = require('../util/notify')
	, config = require('../app/config');

module.exports = function () {
	var dirname = config.folder;
	return new Promise(function (resolve, reject) {
		getFileSystem().then(function (filesystem) {
			makeDir(filesystem, dirname).then(function (response) {
				config.fs = response;
				resolve(response)
			}, reject);
		}, reject);
	})
};
},{"../app/config":2,"../util/notify":29,"./getFile":17,"./getFileSystem":21,"./makeDir":22}],13:[function(require,module,exports){
var getFileSystem = require('./getFileSystem')
	, getFile = require('./getFile')
	, getFileEntry = require('./getFileEntry')
	, writeFile = require('./writeFile');

module.exports = function (filename, contents) {
	return new Promise(function (resolve, reject) {
		getFileSystem().then(function (filesystem) {
			getFile(filesystem, filename, true).then(function (fileentry) {  
				getFileEntry(fileentry).then(function (filewriter) {
					writeFile(filewriter, contents).then(resolve, reject);
				}, reject);
			}, reject);
		}, reject);
	})
};
},{"./getFile":17,"./getFileEntry":19,"./getFileSystem":21,"./writeFile":26}],14:[function(require,module,exports){
var getFileSystem = require('./getFileSystem')
	, getFile = require('./getFile');

module.exports = function (filename) {
	return new Promise(function (resolve, reject) {
		getFileSystem().then(function (filesystem) {
			getFile(filesystem, filename).then(resolve, reject);
		}, reject)
	})
}
},{"./getFile":17,"./getFileSystem":21}],15:[function(require,module,exports){
var config = require('../app/config')
	, getFileSystem = require('./getFileSystem')
	, getFile = require('./getFile')
	, downloadFile = require('./downloadFile');

module.exports = function (url) {
	var filename = url.split('/').pop();
	return new Promise(function (resolve, reject) {
		getFile(config.fs, filename, false).then(resolve,
			function () {
				getFile(config.fs, filename, true).then(function (fileentry) {  
					downloadFile(fileentry, url).then(resolve, reject);
			}, reject);
		}) 
	})
}
},{"../app/config":2,"./downloadFile":16,"./getFile":17,"./getFileSystem":21}],16:[function(require,module,exports){
var config = require('../app/config');

module.exports = function (fileentry, url) {
  var fileTransfer = new FileTransfer()
  , uri = encodeURI(url)
  , path = fileentry.toURL();

  return new Promise(function (resolve, reject) {
	  function catchErrors(reason) {
	  	if (reason.http_status === 404) {
				resolve(config.missingFileRef)
			} else {
				reject(reason);
			}
	  }

    fileTransfer.download(uri, path, resolve, catchErrors, false, {})
  });
};
},{"../app/config":2}],17:[function(require,module,exports){
var config = require('../app/config');

module.exports = function (filesystem, filename, create) {
	var fs = config.fs || filesystem;
	return new Promise(function (resolve, reject) {
		fs.getFile(filename, {create: !!create, exclusive: false}, resolve, reject);
	});
}
},{"../app/config":2}],18:[function(require,module,exports){
var getFileSystem = require('./getFileSystem')
  , getFile = require('./getFile')
  , readFile = require('./readFile');

module.exports = function (filename) {
  return new Promise(function (resolve, reject) {
    getFileSystem().then(function (filesystem) {
      getFile(filesystem, filename).then(function (fileentry) {
        readFile(fileentry).then(resolve, reject);
      }, reject);
    }, reject);
  })
}
},{"./getFile":17,"./getFileSystem":21,"./readFile":24}],19:[function(require,module,exports){
module.exports = function (fileentry) {
	return new Promise(function (resolve, reject) {
		fileentry.createWriter(resolve, reject);
	})
};
},{}],20:[function(require,module,exports){
var getFileSystem = require('./getFileSystem')
  , readDirectory = require('./readDirectory');

module.exports = function (filename) {
  return new Promise(function (resolve, reject) {
    getFileSystem().then(function (filesystem) {
      readDirectory(filesystem).then(resolve, reject);
    }, reject);
  })
}
},{"./getFileSystem":21,"./readDirectory":23}],21:[function(require,module,exports){
module.exports = function () {
	return new Promise(function (resolve, reject) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, resolve, reject)
	})
};
},{}],22:[function(require,module,exports){
var config = require('../app/config');

module.exports = function (filesystem, dirname) {
	return new Promise(function (resolve, reject) {
		var fileentry = filesystem.root;
		fileentry.getDirectory(dirname, {create: true, exclusive: false}, resolve, reject);
	});
}
},{"../app/config":2}],23:[function(require,module,exports){
var config = require('../app/config');

module.exports = function (filesystem) {
	var fs = config.fs || filesystem.root
		, reader = fs.createReader();
		
	return new Promise(function (resolve, reject) {
		reader.readEntries(resolve, reject);
	});
}
},{"../app/config":2}],24:[function(require,module,exports){
module.exports = function (fileentry) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
        fileentry.file(function (f) {
            reader.onloadend = resolve;
            reader.onerror = reject;
            reader.readAsText(f);
        })
    });
};
},{}],25:[function(require,module,exports){
module.exports = function (fileentry) {
    return new Promise(function (resolve, reject) {
        fileentry.remove(resolve, reject)
    });
};
},{}],26:[function(require,module,exports){
module.exports = function (filewriter, contents) {
  return new Promise(function (resolve, reject) {
    filewriter.onwriteend = resolve;
  	filewriter.onerror = reject;
    filewriter.write(contents);
  });
}


},{}],27:[function(require,module,exports){
function get() {
  return navigator.connection.type;
}

function online(e) {
		console.log(e)
    //alert(get())
}

function offline(e) {
    console.log(e)
    //alert(get());
}

module.exports = {
    online: online
    , offline: offline
    , get: get
}
},{}],28:[function(require,module,exports){
module.exports = function (reason) {
	console.log(reason);
}
},{}],29:[function(require,module,exports){
function alert(message, callback, title, buttonLabel) {
	navigator.notification.alert(message, callback, title, buttonLabel);
}

function confirm(message, callback, title, buttonLabels) {
	//title: defaults to 'Confirm'
	//buttonLabels: defaults to [OK, Cancel]
	navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
}

function y(message) {
	alert(message || 'Yes', $.noop, 'W1N', 'MOAR!!!')
}

function n(message) {
	alert(message || 'No', $.noop, 'FA1L', 'Try again!')
}

module.exports = {
	alert: alert,
	confirm: confirm,
	y: y,
	n: n
};
},{}]},{},[10])