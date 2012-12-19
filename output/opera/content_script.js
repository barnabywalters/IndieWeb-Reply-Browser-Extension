// ==UserScript==
// @name IndieWebReply
// @include http://*
// @include https://*
// @require jquery-1.8.3.min.js
// @require URI.js
// ==/UserScript==

/*
 * Copyright (c) 2012 by Aaron Parecki. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var $ = window.$.noConflict(true);

IndieWebReplyModule = (function (){
	// Private
	
	function openNoteUI(verb, replace) {
		
		kango.invokeAsync('kango.storage.getItem', verb + 'URL', function (postURL) {
			if (postURL === undefined) {
				alert('You must set a Reply Post URL in Chrome options in order to use IndieWeb Reply');
				return false;
			}
			
			// Replace template vars
			for (var template in replace) {
				if (replace[template] == undefined)
					continue;
				postURL = postURL.split('{' + template + '}').join(replace[template]);
			}
			
			window.open(postURL);
		});
	}
	
	function parseQueryString(url) {
		var uri = new URI(url);
		return uri.search(true);
	}
	
	function parseQueryStringFragment(url) {
		var uri = new URI(url);
		var fragment = '?' + uri.fragment();
		var fragURI = new URI(fragment);
		
		return fragURI.search(true);
	}
	
	function bindTwitterReplies() {
		$("a.js-action-reply").each(function(i,e){
		  $(e).unbind("click").click(function(evt){
			var tweet = $(evt.target).parents(".tweet");
			var url = "https://twitter.com/" + $(tweet).data('screen-name') + "/status/" + $(tweet).attr('data-item-id');
			
			openNoteUI('reply', {
				url: url
			});
			
			return false;
		  });
		});
	}
	
	function bindAppDotNetReplies() {
		// Set up app.net reply URLs
		$("a[data-reply-to='']").each(function(i,e){
		  $(e).click(function(evt){
			var post = $(evt.target).parents(".post-container");
			var url = "https://alpha.app.net/" + $(post).data('post-author-username') + "/post/" + $(post).attr('data-post-id');
			
			openNoteUI('reply', {
				url: url
			});
			
			return false;
		  });
		});
	}
	
	function bindTwitterShareButtons() {
		$('.twitter-share-button').each(function (i, e) {
			var src = $(e).attr('src');
			
			var properties = parseQueryStringFragment(src);
			
			var newButton = $('<div>Post to your Indieweb Site</div>')
				.css({
					'padding': '0.5em',
					'border': '1px black solid',
					'cursor': 'pointer'
				})
				.click(function () {
					openNoteUI('post', {
						url: properties.url,
						via: '@' + properties.via,
						hashtags: properties.hashtags,
						text: properties.text
					});
				});
		
			$(e).replaceWith(newButton);
		});
	}
	
	// Public
	
	return {
		init: function () {
			bindTwitterReplies();
			setTimeout(bindTwitterReplies, 5000);
			
			bindAppDotNetReplies();
			bindTwitterShareButtons();
		}
	};
}());

$(document).ready(function () {
	IndieWebReplyModule.init();
});