/**
 * Copyright 2020 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class SwipeHandler {

	constructor(options={}) { 
        if ((options) && (options.debug)) console.log("Swipe(%s)...", JSON.stringify(options));

        if (options.container === undefined) options.container = document.body;
        if ((options.container) && (typeof options.container == 'string')) options.container = document.querySelector(options.container);
        if ((options.callback) && (typeof options.callback != 'function')) throw "Swipe: callback is not a function (options.callback)";
        if ((options.leftbutton) && (typeof options.leftbutton == 'string')) options.leftbutton = document.getElementById(options.leftbutton);
        if ((options.rightbutton) && (typeof options.rightbutton == 'string')) options.rightbutton = document.getElementById(options.rightbutton);
        if (!options.sensitivity) options.sensitivity = 200;
        if (!options.sdtags) options.sdtags = [ 'object' ]; 
        if (options.classname === undefined) options.classname = 'swipe-selected';
        
        this.options = options;
        this.panels = [];
        this.zones = [];
        this.touch = { startX: 0, startY: 0, endX: 0, endY: 0 };

        if (this.options.container) {
            var children = this.options.container.children;
            [...children].forEach(child => this.addPanel(child));
        }
    }

    addPanel(panel, zone) {
        if (this.options.debug) console.log("Swipe.addPanel(%s,%s)...", panel, zone);

        if (panel) {
            this.panels.push(panel);
            if ((this.options.classname) && (this.panels.length == 1)) this.panels[0].classList.add(this.options.classname);
            if (!zone) {
                if (this.options.sdtags.map(tag => tag.toLowerCase()).includes(panel.nodeName.toLowerCase())) {
                    (function wait() {
                        if (panel.contentWindow == null) {
                            setTimeout(wait, 500);
                        } else {
                            this.addZone(panel.contentWindow);
                        }
                    }.bind(this))();
                } else {
                    this.addZone(panel);
                }
            } else {
                this.addZone(zone);
            }
        }
    }


    addZone(zone) {
        if (this.options.debug) console.log("Swipe.addZone(%s)...", zone);
        
        if (typeof zone === 'string') zone = document.querySelection(zone);

        if ((zone) && (!this.zones.includes(zone))) {
            this.zones.push(zone);
            zone.addEventListener('touchstart', function(e) { this.touchStart(e); }.bind(this), true);
            zone.addEventListener('touchend', function(e) { this.touchEnd(e); }.bind(this), true);
        }
    }

    touchStart(e) {
        if (this.options.debug) console.log("Swipe.touchStart(%s)...", e);

        this.touch.startX = e.changedTouches[0].screenX;
        this.touch.startY = e.changedTouches[0].screenY;
    }

    touchEnd(e) {
        if (this.options.debug) console.log("Swipe.touchEnd(%s)...", e);

        this.touch.endX = e.changedTouches[0].screenX;
        this.touch.endY = e.changedTouches[0].screenY;
        if ((!this.options.callback) || (this.options.callback(this.touch))) this.handleGesture();
    }

    handleGesture() {
        if (this.options.debug) console.log("Swipe.handleGesture()...");

        if ((this.touch.endX < this.touch.startX) && (this.touch.startX - this.touch.endX) > this.options.sensitivity) this.swipeLeft();
        if ((this.touch.endX > this.touch.startX) && (this.touch.endX - this.touch.startX) > this.options.sensitivity) this.swipeRight();
    }

    swipeLeft() {
        if (this.options.debug) console.log("Swipe.swipeLeft()...");

        this.panels[0].classList.remove(this.options.classname);
        this.panels.push(this.panels.shift());
        this.panels[0].classList.add(this.options.classname);
    }

    swipeRight() {
        if (this.options.debug) console.log("Swipe.swipeRight()...");

        this.panels[0].classList.remove(this.options.classname);
        this.panels.unshift(this.panels.pop());
        this.panels[0].classList.add(this.options.classname);
    }

}
