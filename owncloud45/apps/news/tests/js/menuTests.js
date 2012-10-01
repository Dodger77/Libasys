/**
* ownCloud - News app
*
* @author Bernhard Posselt
* Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
*
* This file is licensed under the Affero General Public License version 3 or later.
* See the COPYING-README file
*
*/

var News = News || {};
var NewsTests = NewsTests || {};

// variables with are used again
NewsTests.jsonStruct = [
    {
        id: 1,
        title: 'hi',
        type: News.MenuNodeType.Folder,        
        unreadCount: 1,
        children: [
            {
                id: 2,
                title: 'hi too',
                type: News.MenuNodeType.Feed,
                unreadCount: 4,
                children: [], 
                icon: 'img/testing.png'
            },
            {
                id: 3,
                title: 'hi 3',
                type: News.MenuNodeType.Feed,    
                children: [],                 
                unreadCount: 3,
            },
            {
                id: 2,
                title: 'hi 3',
                type: News.MenuNodeType.Folder,    
                children: [],                 
                unreadCount: 13,
            },
        ]
    }, 
    {
        id: 4,
        title: 'hi 4',
        type: News.MenuNodeType.Feed,                     
        children: [],
        unreadCount: 1,
    },
    {
        id: 5,
        title: 'hi 4',
        type: News.MenuNodeType.Feed,                     
        children: [],
        unreadCount: 50,
    },
];


QUnit.testStart(function(){
    NewsTests.menu = new News.Menu('feed_menu');
    NewsTests.popMenu = new News.Menu('feed_menu');
    NewsTests.popMenu.populateFromJSON(NewsTests.jsonStruct, NewsTests.popMenu);
    // empty menu
    NewsTests.$menuContainer = $('<div>');
    NewsTests.$menuContainer.append(NewsTests.menu.render());
    NewsTests.$menuDomElem = NewsTests.$menuContainer.children('ul');
    // populated menu
    NewsTests.$popMenuContainer = $('<div>');
    NewsTests.$popMenuContainer.append(NewsTests.popMenu.render());
    NewsTests.$popMenuDomElem = NewsTests.$popMenuContainer.children('ul');
    var menuData = {
        title: 'this is rad',
        unreadCount: 111,
    };
    NewsTests.node = new News.MenuNode(News.MenuNodeType.Feed, 6, menuData);
});


/**
 * Empty menu tests
 */
test('Empty menu should have certain variables', function(){
    equal(NewsTests.menu._children.length, 0);
    equal(NewsTests.menu._class, 'feed_menu');
    equal(NewsTests.menu._parent, false);
    equal(NewsTests.menu.getSize(), 0);
});


test('Empty menu dom should have certain dom elements', function(){
    equal(NewsTests.$menuContainer.length, 1);
    ok(NewsTests.$menuDomElem.hasClass('feed_menu'));
    equal(NewsTests.$menuDomElem.children().length, 0);
});


/**
 * Find node tests
 */
test('Finding a folder node should succeed', function(){
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Folder, 1);
    ok(node !== undefined);
});


test('Finding a nested folder node should succeed', function(){
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Folder, 2);
    ok(node !== undefined);
});


test('Finding a folder node that doesnt exist should fail', function(){
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Folder, 10);
    ok(node === undefined);
});


test('Finding a feed node should succeed', function(){
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Feed, 4);
    ok(node !== undefined);
});


test('Finding a feed node that doesnt exist should fail', function(){
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Feed, 10);
    ok(node === undefined);
});


/**
 * Adding nodes test
 */
test('Adding a node should set children and parent correctly', function(){
    NewsTests.menu._addChildNode(NewsTests.node);
    equal(NewsTests.node._parent, NewsTests.menu);
    ok(NewsTests.menu._children.indexOf(NewsTests.node) !== -1);
    equal(NewsTests.menu.getSize(), 1);
});


/**
 * Creating nodes tests
 */
test('Adding a new node should create the correct dom', function(){
    NewsTests.menu.createNode(News.MenuNodeType.Folder, 0, NewsTests.node);
    equal(NewsTests.$menuDomElem.children().length, 1);
});


/**
 * Removing nodes tests
 */
test('Removing a feed node should remove the correct dom', function(){
    equal(NewsTests.$popMenuDomElem.children().length, 3);

    var child = NewsTests.popMenu.removeNode(News.MenuNodeType.Feed, 2, true);
    ok(child !== undefined);

    // top length should stay the same
    equal(NewsTests.$popMenuDomElem.children().length, 3);
    equal(NewsTests.popMenu._children.length, 3);
    // but size should have been reduced by 1
    equal(NewsTests.popMenu.getSize(), 5);

});

test('Removing a non existent node should not change anything', function(){
    var child = NewsTests.popMenu.removeNode(News.MenuNodeType.Feed, 12, true);
    ok(child === undefined);

    // top length should stay the same
    equal(NewsTests.$popMenuDomElem.children().length, 3);
    equal(NewsTests.popMenu._children.length, 3);
    equal(NewsTests.popMenu.getSize(), 6);

});

test('Removing a parent node should remove its children', function(){
    var child = NewsTests.popMenu.removeNode(News.MenuNodeType.Folder, 1, true);
    ok(child !== undefined);
    equal(NewsTests.$popMenuDomElem.children().length, 2);
    equal(NewsTests.popMenu._children.length, 2);
    equal(NewsTests.popMenu.getSize(), 2);

});


/**
 * Updating nodes tests
 */
test('Updating a node should update the object', function(){
    var data = {
        unreadCount: 112,
        title: 'no way',
        icon: 'test.png'
    };

    NewsTests.popMenu.updateNode(News.MenuNodeType.Feed, 2, data);
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Feed, 2);
    equal(node._unreadCount, data.unreadCount);
    equal(node._title, data.title);
    equal(node._icon, data.icon);
});


test('Updating a node should update the dom', function(){
    var data = {
        unreadCount: 112,
        title: 'no way',
        icon: 'test.png'
    };

    NewsTests.popMenu.updateNode(News.MenuNodeType.Feed, 2, data);
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Feed, 2);
    equal(node._$htmlElement.children('.title').html(), data.title);
    //equal(node._$htmlElement.css('background-image'), data.icon); this fails in firefox, dunno why
});


/**
 * Unread count tests
 */
test('Setting an unread count of 0 should add the all_read class', function(){
    NewsTests.popMenu.updateNode(News.MenuNodeType.Folder, 1, {unreadCount: 0});
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Folder, 1);
    equal(node._unreadCount, 0);
    ok(node._$htmlElement.hasClass('all_read'));
});

test('Setting an unread count of 0 and then 12 should remove the all_read and hidden class', function(){
    NewsTests.popMenu.updateNode(News.MenuNodeType.Folder, 1, {unreadCount: 0});
    NewsTests.popMenu.triggerHideRead();
    NewsTests.popMenu.updateNode(News.MenuNodeType.Folder, 1, {unreadCount: 12});
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Folder, 1);
    equal(node._unreadCount, 12);
    ok(!node._$htmlElement.hasClass('all_read'));
    ok(!node._$htmlElement.hasClass('hidden'));
});

test('Setting an unread count of 0 and triggering the hiding of read feeds should add the hidden class', function(){
    NewsTests.popMenu.updateNode(News.MenuNodeType.Folder, 1, {unreadCount: 0});
    NewsTests.popMenu.triggerHideRead();
    var node = NewsTests.popMenu._findNode(News.MenuNodeType.Folder, 1);
    ok(node._$htmlElement.hasClass('hidden'));
});