<?php

/**
* ownCloud - News app
*
* @author Alessandro Cosentino
* Copyright (c) 2012 - Alessandro Cosentino <cosenal@gmail.com>
*
* This file is licensed under the Affero General Public License version 3 or later.
* See the COPYING-README file
*
*/

// Check if we are a user
OCP\User::checkLoggedIn();

OCP\App::checkAppEnabled('news');
OCP\App::setActiveNavigationEntry('news');

OCP\Util::addScript('news','main');
OCP\Util::addScript('news','news');
OCP\Util::addScript('news','menu');
OCP\Util::addScript('news','items');
OCP\Util::addScript('news','jquery.timeago');

OCP\Util::addStyle('news','news');
OCP\Util::addStyle('news','settings');

$l = OC_L10N::get('news');

$userid = OCP\USER::getUser();

$foldermapper = new OCA\News\FolderMapper($userid);

$allfeeds = $foldermapper->childrenOfWithFeeds(0); //$foldermapper->populate($folder);
$folderforest = $foldermapper->childrenOf(0); //retrieve all the folders

$feedid = 0;
$feedtype = 0;

if ($allfeeds) {
	$feedid = isset( $_GET['feedid'] ) ? $_GET['feedid'] : null;
	if ($feedid == null) {
		$feedmapper = new OCA\News\FeedMapper(OCP\USER::getUser($userid));
		$lastViewedId = OCP\Config::getUserValue($userid, 'news', 'lastViewedFeed');
		$lastViewedType = OCP\Config::getUserValue($userid, 'news', 'lastViewedFeedType');
		if( $lastViewedId == null || $lastViewedType == null) {
		    $feedid =  $feedmapper->mostRecent();
		} else {
		    $feedid = $lastViewedId;
		    $feedtype = $lastViewedType;
		    // check if feed exists in table
		    if($feedmapper->findById($feedid) === null) {
				$feedid =  $feedmapper->mostRecent();
		    }
		}
	}
}

$tmpl = new OCP\Template( 'news', 'main', 'user' );
$tmpl->assign('allfeeds', $allfeeds);
$tmpl->assign('folderforest', $folderforest);
$tmpl->assign('feedid', $feedid);
$tmpl->assign('feedtype', $feedtype);
$tmpl->printPage();
