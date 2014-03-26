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

var connection = require('./util/connection')
	, config = require('./app/config');

module.exports = (function () {
		document.addEventListener('online', connection.online, false);
		document.addEventListener('offline', connection.offline, false);
		
    document.addEventListener('deviceready', appReady, false);

    function appReady() {
    	//setTimeout(function () {
				//require('./test');
				$(function () {
					if (config.track && analytics) {
						analytics.startTrackerWithId('UA-31877-29');
						analytics.trackEvent('Init', 'Load', 'App Started');
					}
					require('./init');
				})
				/*setTimeout(function () {
					navigator.splashscreen.hide();
				}, 200)*/
    	//}, 6000)
      
    }
}());