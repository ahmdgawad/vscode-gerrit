/*
 * @Author: liupei 
 * @Date: 2019-09-24 15:00:07 
 * @Last Modified by: liupei
 * @Last Modified time: 2019-09-25 10:38:45
 */

import * as vscode from 'vscode';
import axios from 'axios';

import { gerritChannel } from './gerritChannel';
import { gerritExecutor } from './gerritExecutor';
import { DialogType, promptForOpenOutputChannel } from './utils/uiUtils';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	try {
		if (!await gerritExecutor.meetRequirements()) {
			throw new Error('The environment dosen');
		}
		let cityAqi = vscode.commands.registerCommand('extension.sayCityAqi', function () {
			const options = {
				ignoreFocusOut: true,
				password: true,
				prompt: 'Please type your city (eg.beijing or 北京)',
			};
				
			vscode.window.showInputBox(options).then(value => {
				if (value === undefined || value.trim() === '') {
					promptForOpenOutputChannel("Extension initialization failed. Please open output channel for details.", DialogType.ERROR);
				} else {
					const cityName = value.trim();
					axios.get(`https://way.jd.com/he/freeweather?city=${cityName}&amp;appkey=xxxxxxxx`)
					.then(rep => {
						if (rep.data.code !== '10000') {
							vscode.window.showInformationMessage('Sorry, Please try again.');
							return;
						}
						const weatherData = rep.data.result.HeWeather5[0];
						if (weatherData.status !== 'ok') {
							vscode.window.showInformationMessage(`Sorry, ${weatherData.status}`);
							return;
						}
						vscode.window.showInformationMessage(`${weatherData.basic.city} 's AQI =&gt; PM25: ${weatherData.aqi.city.pm25}, PM10: ${weatherData.aqi.city.pm10} ${weatherData.aqi.city.qlty}`);
					});
				}
			});
		});
			
		context.subscriptions.push(cityAqi);
	} catch (error) {
		gerritChannel.appendLine(error.toString());
        promptForOpenOutputChannel("Extension initialization failed. Please open output channel for details.", DialogType.ERROR);
	}
}
