<?php
/**
 * ownCloud - Addressbook
 *
 * @author Thomas Tanghus
 * @copyright 2012 Jakob Sack <mail@jakobsack.de>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

// Check if we are a user
OCP\JSON::checkLoggedIn();
OCP\JSON::checkAppEnabled('mail');

$account_id = isset( $_GET['account_id'] ) ? $_GET['account_id'] : null;
$folder_id = isset( $_GET['folder_id'] ) ? $_GET['folder_id'] : null;
$from = isset( $_GET['from'] ) ? $_GET['from'] : null;
$count = isset( $_GET['count'] ) ? $_GET['count'] : null;

$messages = OCA_Mail\App::getMessages( OCP\User::getUser(), $account_id, $folder_id, $from, $count );

$tmpl = new OCP\Template('mail','part.message_list');
$tmpl->assign('account_id', $messages['account_id'] );
$tmpl->assign('folder_id', $messages['folder_id'] );
$tmpl->assign('messages', $messages['messages'] );
$page = $tmpl->fetchPage();

OCP\JSON::success(array('data' => $page ));
