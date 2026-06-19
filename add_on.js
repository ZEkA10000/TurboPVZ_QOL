    // ==UserScript==
    // @name         Turbo PVZ Extra Utilities
    // @namespace    http://tampermonkey.net/
    // @version      0.1.107
    // @description  QOL дополнение к сайту Турбо ПВЗ!
    // @author       zeka10000
    // @match        https://turbo-pvz.ozon.ru/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_deleteValue
    // @grant        GM_listValues
    // @grant        GM_xmlhttpRequest
    // ==/UserScript==

//document.regexClassSelector("_isPostPayment_").regexClassSelector("_widgetList_").firstElementChild

//

//<div>3&nbsp;705,00 ₽</div>

    (function() {
        'use strict';

        // Первичная инициализация
        String.prototype.format = function(...values) {
            let result = this
            for (let i in range(values.length)) {
                result = result.replaceAll(`{${i}}`, values[i])
            }
            return result
        }

        let _style = document.createElement("style")
        _style.classList.add("_z_style_")

        let _custom_style = `
                .z_button_function {
                    background: rgba(30, 55, 105, 0.06);
                    cursor: pointer;
                    border-radius: 8px;
                    padding: 0 16px;
                    border-style: none;
                    color: rgb(0, 91, 251);
                    font-size: 15px;
                    font-weight: 600;
                    height: 32px;
                    transition: 0.3s;
                    text-decoration: none;

                    &:hover {
                        background: rgba(30, 55, 105, 0.1);
                        text-decoration: underline
                    }
                }
                span.z_left { transform: translate(0px); }
                span.z_right { transform: translate(16px); }
                .z_checkbox {
                    display:inline-block;
                    width:30px;
                    height:14px;
                    border: none;
                    background-color: #0f2d4b26;
                    transition: 0.3s;
                    padding: 3px;
                    border-radius: 10px;
                    text-align: left;
                    user-select: none;
                    margin-right: 10px;

                    & .z_left, & .z_right {
                        display: inline-block;
                        width:14px;
                        height:14px;
                        border: none;
                        background-color: white;
                        border-radius: 7px;
                        transition: 0.3s;
                    }
                }
                .z_i_checkbox {
                    stroke: #005bff;
                    transition: 0.3s
                }
                .timer_activator {
                    display:block;
                    grid-row: 1;
                    line-height: 30px;
                    cursor:pointer;
                    border: 1px black solid;
                    border-radius: 5px; width: 32px;
                    height: 28px;
                    text-align: center;
                    margin: 1px -1px 0px 0px;
                }
                .z_timer {
                    display: grid;
                    background-image: linear-gradient(to right, rgb(0, 68, 0), rgb(0, 187, 0)), linear-gradient(to right, rgb(17 0 0), rgb(85, 0, 0));
                    width: 0px;
                    height: 30px;
                    background-size: 0%, auto;
                    background-repeat: no-repeat, no-repeat;
                    color:white;
                    text-align: center;
                    font-size: 16px;
                    text-shadow: -1px 1px 0 #000,-0 -1px 0 #000,0 -1px 0 #000,-0 1px 0 #000,0 1px 0 #000,-1px -0 0 #000,1px -0 0 #000,-1px 0 0 #000,1px 0 0 #000,-1px -1px 0 #000,1px -1px 0 #000,1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                    transition: 0.3s;
                    transition-property: width;
                    grid-row: 1;
                    overflow:hidden;
                    border: 1px transparent solid;
                    border-radius: 0 10px 10px 0;
                }
                .z_timer_text, .z_timer_percent {
                    display:block;
                    grid-row: 1;
                    line-height: 30px;
                    margin: 0;
                }
                .z_auto_give {
                    display: table-cell;
                    width: auto;
                }
                .z_settings_container {
                    font-size: 15px;
                    margin-top: 7px;
                    border: 1px solid #6183a242;
                    border-radius: 10px;
                    padding: 16px 24px;
                    width: 750px;
                }
                .z_popup {
                    /*width: 368px;*/
                    padding: 5px 5px;
                    border-radius: 8px;
                    color: white;
                    opacity: 0;
                    animation: appear 10s ease-in-out forwards;

                    &.success { background: linear-gradient(to right, #34d865 4px, #202e41bb 4px); }
                    &.warning { background: linear-gradient(to right, #c8d834 4px, #202e41bb 4px); }
                    &.error   { background: linear-gradient(to right, #d83434 4px, #202e41bb 4px); }
                    &.log     { background: linear-gradient(to right, #bbb 4px, #202e41bb 4px); }

                    & div { display: grid; justify-content: start; }

                    & p {
                        line-height: 20px;
                        margin: 0;
                    }

                    & .sign {
                        width: 30px;
                        font-size: 20px;
                    }
                    & .header {
                        font-weight: bold;
                        font-size: 16px;
                        grid-area: 1 / 2;
                    }
                    & .description {
                        font-size: 15px;
                        grid-area: 2/2
                    }
                }
                #z_notify_layer {
                    position: fixed;
                    z-index: 1501;
                    right: 0;
                    left: auto;
                    bottom: 0;
                    top: auto;
                    padding: 10px;
                    pointer-events: none;
                }
                @keyframes appear {
                    from {
                        opacity: 0;
                        margin-top: -94px;
                    }
                    5%, 95%{
                        opacity: 1;
                        margin-top: 10px;
                    }
                    to {
                        opacity: 0;
                    }
                }
                #settings_inside {
                    overflow:hidden;
                    height:0px;
                    transition:0.3s;
                    display: grid;
                    grid-gap: 10px;
                    & p {
                        margin: 0
                    }

                }
                .z_setting_header {
                    font-size: 17px;
                    margin: 0px;
                    font-weight: bold;
                    &.group_header {
                        text-shadow: -1px 1px 0 #fff,-0 -1px 0 #fff,0 -1px 0 #fff,-0 1px 0 #fff,0 1px 0 #fff,-1px -0 0 #fff,1px -0 0 #fff,-1px 0 0 #fff,1px 0 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
                        margin-top: -20px !important;
                        color: royalblue;
                    }
                }
                .setting_category {
                    border: 1px #6183a242 solid;
                    padding: 5px;
                    margin-top: 10px;
                    height: fit-content;
                    border-radius: 8px;
                }
                .blue_button {
                    background-color: #005bff;
                    color: white;
                    border: 1px transparent solid;
                    border-radius: 8px;
                    padding: 6px 0;
                    font-family: Onest, Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                }
                .blue_button:hover {
                    background-color: rgb(0, 80, 224);
                }

                @keyframes custom_existment {
                  from, to { transform: scale(1); opacity: 1; }
                  5% { opacity: 0.6 }
                  10% { opacity: 1 }
                  15% { opacity: 0.6 }
                  20% { opacity: 1 }
                  25% { opacity: 0.6 }
                  30% { opacity: 1 }
                  35% { opacity: 0.6 }
                  40% { opacity: 1 }
                  45% { opacity: 0.6 }
                  50% { transform: scale(1.1); opacity: 1 }
                  55% { opacity: 0.6 }
                  60% { opacity: 1 }
                  65% { opacity: 0.6 }
                  70% { opacity: 1 }
                  75% { opacity: 0.6 }
                  80% { opacity: 1 }
                  85% { opacity: 0.6 }
                  90% { opacity: 1 }
                  95% { opacity: 0.6 }

                }

                .custom_exist_animation { animation: custom_existment 2s !important; }
                {0}
                `



        let notifier = document.createElement("div")
        notifier.id = "z_notify_layer"

        /**
                 * @typedef {Object} Settings
                 * @property {boolean} hide_ads
                 * @property {boolean} tell_amount
                 * @property {boolean} time_now
                 * @property {boolean} time_until_end
                 * @property {boolean} time_hide
                 * @property {boolean} time_show_percent
                 * @property {string} start_job
                 * @property {string} end_job
                 * @property {boolean} anti_packing
                 * @property {boolean} popups
                 * @property {boolean} ignore_cancel_popup
                 * @property {boolean} another_castle
                 * @property {boolean} tell_unpaid_info
                 * @property {boolean} sendKTAAppear
                 * @property {string[]} ads_list
                 */

        class TM_Database {
            constructor() {
                this.defaults = {
                    hide_ads: false,
                    tell_amount: true,
                    time_now: false,
                    time_until_end: true,
                    time_hide: false,
                    time_show_percent: true,
                    start_job: "09:00",
                    end_job: "21:00",
                    anti_packing: false,
                    popups: false,
                    ignore_cancel_popup: false,
                    another_castle: false,
                    tell_unpaid_info: false,
                    sendKTAAppear: false,
                    ads_list: []
                }
                this.db = GM_getValue("localSettings", this.defaults)

                console.log(this.db)
            }
            /**
                     * @param {keyof Settings} key
                     * @param {any} default_value
                     */
            get(key, default_value=null) {
                return key in this.db ? this.db[key] : default_value;
            }

            /**
                     * @param {keyof Settings} key
                     * @param {any} value
                     */
            set(key, value) {
                this.db[key] = value;
                console.log(`${key} = ${value}`)
                this.save();
            }
            save() {
                GM_setValue("localSettings", this.db)
                console.log("Сохраняем изменения")
            }
            reset() {
                this.db = this.defaults
            }
        }

        var _ls = new TM_Database()
        //alert(_ls.get("end_job"))

        _style.innerHTML = _custom_style.format(`.${_ls.get("ads_list", []).join(", .")} {display:none}`)


        let workStart = new Date();
        let workEnd = new Date();

        // Полезные функции

        // Диапазон как в Python [start .. end]
        function range(start, end=null, step=1) {
            if (step == 0) {
                console.error("Step must be not zero")
                return []
            }
            let _start = end ? start : 0
            let _end = end ? end : start
            let _range = []
            if (step > 0) {
                for (;_start < _end; _start += step) { _range.push(_start) }
            } else {
                for (;_start > _end; _start += step) { _range.push(_start) }
            }
            return _range
        }

        const print = console.log

        // Проверка если число больше одного и меньше иного
        Number.prototype.between = function(n1, n2, include_last = false) {
            let min = Math.min(n1, n2)
            let max = Math.max(n1, n2) + (include_last ? 1 : 0)
            return range(min, max).includes(this.valueOf())
        }

        function simulateHTML5DragDrop(source, target) {
            if (!source || !target) {
                console.error('Source or target element not found');
                return;
            }

            // Получаем координаты центра исходного элемента (относительно viewport)
            const sourceRect = source.getBoundingClientRect();
            const sourceX = sourceRect.left + sourceRect.width / 2;
            const sourceY = sourceRect.top + sourceRect.height / 2;

            // Координаты центра целевого элемента
            const targetRect = target.getBoundingClientRect();
            const targetX = targetRect.left + targetRect.width / 2;
            const targetY = targetRect.top + targetRect.height / 2;

            // Создаём DataTransfer для передачи данных
            const dataTransfer = new DataTransfer();

            // 1. Событие dragstart на исходном элементе
            const dragStartEvent = new DragEvent('dragstart', {
                clientX: sourceX,
                clientY: sourceY,
                bubbles: true,
                cancelable: true,
                composed: true,
                dataTransfer: dataTransfer
            });
            source.dispatchEvent(dragStartEvent);

            // Небольшая задержка, чтобы дать возможность обработчикам выполниться
            setTimeout(() => {
                // 2. Событие drag (необязательно, но некоторые сайты могут на него реагировать)
                const dragEvent = new DragEvent('drag', {
                    clientX: sourceX,
                    clientY: sourceY,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    dataTransfer: dataTransfer
                });
                source.dispatchEvent(dragEvent);

                // 3. Событие dragover на целевом элементе (обязательно для разрешения сброса)
                const dragOverEvent = new DragEvent('dragover', {
                    clientX: targetX,
                    clientY: targetY,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    dataTransfer: dataTransfer
                });
                target.dispatchEvent(dragOverEvent);

                // 4. Событие drop на целевом элементе
                const dropEvent = new DragEvent('drop', {
                    clientX: targetX,
                    clientY: targetY,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    dataTransfer: dataTransfer
                });
                target.dispatchEvent(dropEvent);

                // 5. Событие dragend на исходном элементе
                const dragEndEvent = new DragEvent('dragend', {
                    clientX: targetX,
                    clientY: targetY,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    dataTransfer: dataTransfer
                });
                source.dispatchEvent(dragEndEvent);
            }, 50); // небольшая задержка, можно подобрать под сайт
        }
        // Симуляция клика на элемент
        function click_on(target) {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });

            target.dispatchEvent(event);
        }

        // Симуляция ввода текста в элемент
        function inputText(target, text) {
            target.value = text;
            const event = new InputEvent('input', {
                bubbles: true,
                cancelable: true
            });
            target.dispatchEvent(event);
        }
        var evade_global_enter = false
        function simulateEnterEnd(target) {
            // убедиться, что курсор в конце (опционально)
            const len = target.value.length;
            try { target.setSelectionRange(len, len); } catch (e) {}

            evade_global_enter = true
            // триггерим input (на случай, если обработчики ждут его)
            target.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));

            // посылаем последовательность клавиат. событий для Enter
            const makeKey = (type) => new KeyboardEvent(type, {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            target.dispatchEvent(makeKey('keydown'));
            target.dispatchEvent(makeKey('keypress'));
            target.dispatchEvent(makeKey('keyup'));

            // если ожидается отправка формы по Enter — инициируем submit
            if (target.form) {
                if (typeof target.form.requestSubmit === 'function') target.form.requestSubmit();
                else target.form.submit();
            }

            // окончательное событие change (если кто-то слушает)
            target.dispatchEvent(new Event('change', { bubbles: true }));
            evade_global_enter = false
        }

        // Гибкий поиск querySelector и querySelectorAll

        function search_class_regex(_class, sender, all=false) {
            let all_elements = sender.querySelectorAll('[class]');
            let regex = new RegExp(_class)
            let matched = null
            if (all) { matched = Array.from(all_elements).filter(element => regex.test(element.className)); }
            else { matched = Array.from(all_elements).find(element => regex.test(element.className)); }
            return matched
        }

        Element.prototype.regexClassSelector = function(_class) { return search_class_regex(_class, this) }
        Element.prototype.regexClassSelectorAll = function(_class) { return search_class_regex(_class, this, true) }
        Element.prototype.getClassFromRegexSelector = function(_class) {
            let element = search_class_regex(_class, this)
            for (let e of element.classList) { if (e.includes(_class)) { return e } }
            return classname
        }

        document.regexClassSelector = function(_class) { return search_class_regex(_class, document) }
        document.regexClassSelectorAll = function(_class) { return search_class_regex(_class, document, true) }
        document.getClassFromRegexSelector = function(_class) {
            let element = search_class_regex(_class, document)
            for (let e of element.classList) {
                if (e.includes(_class)) { return e } }
            return classname
        }

        // Локальная функция для галочки

        function check_switch(target) {
            let state = target.getAttribute("on") == "false"
            target.firstElementChild.setAttribute('class', `${state ? 'z_right': 'z_left'}`)
            target.setAttribute('on', state)
            target.style.backgroundColor = state ? "#005bff" : "#0f2d4b26"
        }

        function make_an_image_checkbox(name, img, is_svg, img_width = 24, img_height = 24, width=24, height=24) {
            let check = null
            if (is_svg) {
                check = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                check.setAttribute("viewBox", `0 0 ${img_width}, ${img_height}`)
                check.setAttribute("width", width)
                check.setAttribute("height", height)
                check.innerHTML = `<title>${name}</title>` + img
            } else {
                check = document.createElement("img")
                check.src = img
                check.setAttribute("title", name)
            }
            check.classList.add("z_i_checkbox")
            check.setAttribute("on", 'false')
            check.style.filter = `grayscale(1)`
            check.style.opacity = 0.5

            check.is_active = function() {
                return this.getAttribute("on") == "true"
            }
            check.onclick = function() {
                this.setAttribute("on", this.is_active() ? "false" : "true")
                this.style.filter = `grayscale(${Number(!this.is_active())})`
                this.style.opacity = 0.5 + (0.5 * Number(this.is_active()))
            }
            return check
        }

        // Создать галочку
        function make_a_checkbox(name, invert_elements = false) {
            let check = document.createElement("p")
            let outer_span = document.createElement("span")
            check.style.lineHeight = "14px"
            check.style.fontSize = "15px"
            check.style.marginBottom = "3px"
            outer_span.classList.add("z_checkbox")
            outer_span.innerHTML = '<span class="z_left"></span>'
            outer_span.setAttribute("on", 'false')
            outer_span.onclick = () => { check_switch(outer_span) }
            let _name = document.createTextNode(name)
            if (invert_elements) {
                outer_span.style.marginRight = 0
                outer_span.style.marginLeft = "10px"
                check.appendChildren(_name, outer_span)
            } else {
                check.appendChildren(outer_span, _name)
            }
            check.is_active = function() {
                return check.firstElementChild.getAttribute("on") == "true"
            }
            return check
        }

        function uniques(arr) {
            if (arr.length === 1) { return arr };
            var a = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                if (a.indexOf(arr[i]) === -1) {
                a.push(arr[i]);
                }
            }
            return a;
        }

        /**
                //  * @param {"OK" | "WARNING" | "ERROR" | "LOG"} status
                **/
        function print_message({header="", status="OK", tries=-1, name="", template=""}) {
            if (header=="" && tries==-1 && template=="") return
            let _defaults = {
                "OK":      { header: "Готово",         class: "success", sign: "✅" },
                "WARNING": { header: "Предупреждение", class: "warning", sign: "⚠️" },
                "ERROR":   { header: "Ошибка",         class: "error",   sign: "❌" },
                "LOG":     { header: "Сообщение",      class: "log",     sign: "ℹ️" }
            }

            let text = template.format(name)
            let _tries = `Попыток ${tries}`
            let _def = _defaults[status]
            if (header == "") header = _def.header + (tries > 0 ? "&nbsp;&nbsp;|&nbsp;&nbsp;" + _tries : "")


            if (_ls.get("popups", false)) {
                let _container = document.createElement("div")
                _container.classList.add("z_popup", _def.class)

                _container.innerHTML = `<div><p class="sign"> ${_def.sign} </p><p class="header">${header}</p><p class="description">${text}</p></div>`

                //if (status == "OK") rightAnswer.play()
                document.querySelector("#z_notify_layer").appendChild(_container)
                setTimeout(() => {_container.remove() }, 10000)
                if (status == "ERROR") {
                    text = text.replace("<br>", "\n")
                    console.error(text)
                }

            } else {
                text = text.replace("<br>", "\n")
                switch (status) {
                    case "ERROR": { console.error(text); break }
                    case "WARNING": { console.warn(text); break }
                    case "LOG", "OK": { console.log(text); break }
                }
            }
        }

        // Пихнуть несколько элементов
        Element.prototype.appendChildren = function (...elements) { elements.forEach(element => { this.appendChild(element) }); }

        document.body.appendChildren(_style, notifier)

        // Проверить наличие элемента
        Element.prototype.isHave = function(selector) { return this.querySelector(selector) !== null; };
        document.isHave = function(selector) { return document.querySelector(selector) !== null; };

        // for (let i == 0; i < Number; i++) { ... }
        Number.prototype.times = function(callback) { for (let i of range(this)) callback(i) }

        // Гибкий способ узнать ссылку
        function isOn(template) { return Boolean(window.location.href.match(template)) }

        // const blackListedHost = "httpas://st.ozone.ru/s3/turbo-pvz-ui-bucket/mp3/"

        // const originalFetch = window.fetch;
        // window.fetch = function(...args) {
        //     const url = args[0];
        //     if (typeof url === 'string' && url.includes(blackListedHost)) {
        //         console.log(`Блокировка загрузки через fetch: ${url}`);
        //         return Promise.reject(new Error('Блокировка загрузки с этого домена'));
        //     }
        //     return originalFetch.apply(this, args);
        // };

        // const originalXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
        // XMLHttpRequest.prototype.open = function(method, url) {
        //     if (url.includes(blackListedHost) && url.includes("error")) { // Замените 'example.com' на домен, который вы хотите заблокировать
        //         arguments[1] = replaceSound(url)
        //         return originalXMLHttpRequestOpen.apply(this, arguments);
        //     }
        //     return originalXMLHttpRequestOpen.apply(this, arguments);
        // };

        // Строка для хранения перехваченного ШК
        var scannedData = '';
        // Технический таймер обнудения строки
        var timer;
        // Задержка в миллисекундах
        const delay = 1000;

        //Object.defineProperty(Event.prototype, 'isTrusted', { get: () => true });

        function enterSHK(code, element=null) {
            evade_global_enter = true
            /*
            console.log(element)

            if (element == null) {
                switch (cUrl) {
                    case "https://turbo-pvz.ozon.ru/orders": element = document.querySelector('[data-testid="searchInput"]'); break
                    case "https://turbo-pvz.ozon.ru/search": element = document.querySelector('[inputmode="search"]'); break
                    default: element = document.body
                }
            }
            element.value = code;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

            console.log("code entered")
            */
            element.focus()
            for (const char of code) {

                element.dispatchEvent(new KeyboardEvent('keydown', {
                    key: char,
                    code: 'Key' + char.toUpperCase(),  // условно; для цифр это Digit1 и т.д.
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    shiftKey: char == char.toUpperCase(),
                    cancelable: true,
                    composed: true
                }));
                // keyup
                element.dispatchEvent(new KeyboardEvent('keyup', {
                    key: char,
                    code: 'Key' + char.toUpperCase(),
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    shiftkey: char == char.toUpperCase(),
                    bubbles: true,
                    cancelable: true,
                    composed: true
                }));
            }

            // Завершающий Enter
            element.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            }));

            console.log("code entered at", element)
            evade_global_enter = false
        }

        document.addEventListener('keyup', async (event) => {
            if (event.key == "Enter") {
                if (isOn(/outbound\?id=\d+/)) {
                    console.log("Обрабатываем упаковку")
                    console.log('Считанный штрих-код:', scannedData);
                    scannedData = processScannedBarcode(scannedData); // Обрабатываем штрих-код
                    console.log('Обработанный штрих-код:', scannedData);
                    if (Boolean(document.querySelector(".z_anti_box")) && document.querySelector(".z_anti_box").is_active()) {
                        console.log("нажимаем кнопку")
                        //alert(`Обработан штрих-код: ${scannedData}`);
                        let go_forward = await try_to_do( () => {
                            let _arr = document.regexClassSelectorAll(/ozi__radio__leftContent__/)
                            click_on(_arr[_arr.length - 1])
                        }, 100, 200, "Нажимаем кнопку. Упаковка не требуется")
                        if (go_forward) {
                            console.log("Вводим ШК")
                            go_forward = await try_to_do( () => {
                                enterSHK(scannedData, document.querySelector("[placeholder='Только с помощью сканера']"))
                            }, 50, 2000, "Вводим ШК. Упаковка не требуется")
                        }
                        if (go_forward) {
                                go_forward = await try_to_do( () => {
                                    if (document.regexClassSelectorAll(/ozi__drawer__right__/).length > 0) throw "Жди сука"
                                    console.log("Вводим после подтверждения")
                                    enterSHK(scannedData, document.body)
                                    // document.regexClassSelector(/_containerFull_/)
                                }, 50, 500, "Вводим ШК, отправляем в поток. Упаковка не требуется.")
                        }
                        if (go_forward) {
                            console.log("Принудительно чистим ШК")
                            scannedData = '';
                        }
                    }
                }
            } else {

            }
           // console.log(event)
        })

        // Перехват сканера
        document.addEventListener('keydown', async (event) => {
            //console.log(event)
            if (event.key == "Enter" && !evade_global_enter) {
                console.log("Enter нажат")
                if (cUrl == "https://turbo-pvz.ozon.ru/orders" && _ls.get("another_castle", false)) {
                    let full_adress = document.regexClassSelector(/_businessSection_/).lastElementChild.lastChild.wholeText.split(",")
                    let adress = full_adress.slice(-3).join("").trim()
                    let progress = try_to_do(() => nigga_say(`Заказ клиента находится по адресу: ${adress}`, true), 50, 100, "Ваша принцесса в другом замке")
                    //if (progress) { clearTimeout(timer_for_wrong_adress) }
                    scannedData = '';
                    return
                }
                if (cUrl.startsWith("https://turbo-pvz.ozon.ru/orders/session")) {
                    try_to_do( () => {
                        let item = document.regexClassSelector(/_scanAnimate_/)
                        item.classList.forEach(e => {
                            //console.log(e)
                            if (e.includes("_scanAnimate_")) {
                                item.classList.remove(e)
                                return
                            }
                        })
                        item.classList.remove("custom_exist_animation")
                        item.classList.add("custom_exist_animation")
                    }, 50, 100, "Замена анимации")
                }
                if (!isOn(/outbound\?id=\d+/)) {
                    scannedData = '';
                    return
                } else {
/*
                    console.log("Обрабатываем упаковку")
                    console.log('Считанный штрих-код:', scannedData);
                    scannedData = processScannedBarcode(scannedData); // Обрабатываем штрих-код
                    console.log('Обработанный штрих-код:', scannedData);
                    if (Boolean(document.querySelector(".z_anti_box")) && document.querySelector(".z_anti_box").is_active()) {
                        //alert(`Обработан штрих-код: ${scannedData}`);
                        let go_forward = await try_to_do( () => {
                            let _arr = document.regexClassSelectorAll(/ozi__radio__leftContent__/)
                            click_on(_arr[_arr.length - 1])
                        }, 100, 200, "Нажимаем кнопку. Упаковка не требуется")
                        if (go_forward) {
                            go_forward = await try_to_do( () => {
                              //  setTimeout( () => {
                                enterSHK(scannedData, document.querySelector("[placeholder='Только с помощью сканера']"))
                              //  }, 200)
                            }, 50, 200, "Вводим ШК. Упаковка не требуется")
                        }
                        if (go_forward) {
                           setTimeout( async () => {
                                go_forward = await try_to_do( () => {
                                    enterSHK(scannedData, document.body)
                                    // document.regexClassSelector(/_containerFull_/)
                                }, 50, 100, "Вводим ШК, отправляем в поток. Упаковка не требуется.")
                            }, 2000)
                        }
                        scannedData = '';
                    }*/
                }
            } else {
                //   console.log(event.code, event.key, event.keyCode, event.which, event.shift)
                if (event.key.match(/\S/) && event.key.length == 1) {
                    scannedData += processScannedBarcode(event.key)
                   // console.log(scannedData)
                    clearTimeout(timer); // Сбрасываем таймер
                    timer = setTimeout(() => {
                        console.log(`Буфер ШК очищен ${scannedData}`)
                        scannedData = ""
                    }, 5000)
                }
            }
        });

        // Обработка перехваченного кода, чтобы была только латиница
        function processScannedBarcode(barcode) {
            let _bc = barcode
            let rus = "ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ"
            let eng = `QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>`
            for(let i = 0; i < rus.length; i++) {
              _bc = _bc.replaceAll(rus[i], eng[i])
              _bc = _bc.replaceAll(rus[i].toLowerCase(), eng[i].toLowerCase())
            }
            return _bc
        }

        // Попытка выполнить задачу
        async function try_to_do(callback, _max_attempts = 50, interval=100, comment="") {
            let now = new Date()
           // console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}::${now.getMilliseconds()} > Пробуем выполнить ${comment}`)
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            let error = ""
            let state = ""
            for (let i = 0; i < _max_attempts; i++) {
                try {
                    state = callback()
                    if (comment != "") {
                        if (state == "CANCELLED" && !_ls.get("ignore_cancel_popup")) {
                            print_message({header: "Отмена", status: "WARNING", tries: i, name: comment, template: 'Операция "{0}" отменена!'})
                        }
                        if (state == "OK" ) {
                            print_message({header: "", status: "OK", tries: i, name: comment, template: `Операция "{0}" проведена успешно!`})
                        }
                    }
                    return true
                } catch (e) {
                    error = e.message
                    await delay(interval)
                }
            }
            console.error(error)
            print_message({header: "", status: "ERROR", tries: _max_attempts, name: comment, template: `Операция "{0}" вызывает ошибки! <br> Подробности в консоли...`})
            return false
        }

        function make_a_button(text, blue=false, callback=null) {
            const button = document.createElement("button");
            button.innerHTML = text;
            if (blue) {
                button.classList.add("blue_button")
            } else {
                button.classList.add("z_button_function")
            }
            if (callback) { button.onclick = callback }
            return button
        }

        // TTS
        var voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Dmitry Online (Natural) - Russian (Russia)');
        function nigga_say(text, fast=false) {
            if ('speechSynthesis' in window) {
                // Создаем новый объект SpeechSynthesisUtterance
                const utterance = new SpeechSynthesisUtterance(text);

                // Установите свойства (опционально)
                utterance.lang = 'ru-RU'; // Установите язык на русский
                utterance.pitch = 1; // Высота тона
                utterance.rate = fast ? 1.5 : 1; // Скорость
                if (!voice) voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Dmitry Online (Natural) - Russian (Russia)');
                utterance.voice = voice
                console.log(voice)

                // Запуск TTS
                window.speechSynthesis.speak(utterance);
            } else {
                console.error('Ваш браузер не поддерживает Web Speech API.');
            }
        }

        // Текущая ссылка
        var cUrl = ""

        // Проверка перехода ссылки
        setInterval(() => {
            let link = window.location.href//.split("?")[0]
            link = link.replace(/\??SCROLL_TO_POSTING_QUERY=\d+/, "")
            if (link != cUrl) {
                cUrl = link
                // console.log("ссылка обновилась")

                // Потоки
                setTimeout(() => {try_to_do(createOutboundButtons, 50, 100, "Создать кнопки потока")}, 500)

                // TTS
                if (_ls.get("tell_amount") == false) try_to_do(tellItemAmount, 50, 100, "Назвать количество товаров")

                // TTS
                setTimeout(() => { try_to_do(calculateUnpaidItems, 50, 100, "Подсчитать сумму к оплате") }, 2000)

                // Автовыдача
                try_to_do(createAutoGivingButton, 50, 100, "Создать кнопку Выдать автоматически")

                // Проверить всё
                try_to_do(createCheckAllButton, 50, 100, "Создать кнопку Проверить всё")

                // Настройки
                try_to_do(createSettingsMenu, 50, 100, "Создание раздела настроек")

                // Часы
                try_to_do(createTimer, 100, 100, "Вставить таймер в шапку")
                try_to_do(activateTimer, 100, 100, "Запуск таймера")

                try_to_do(addOutboundFeatures, 50, 100, "Улучшайзинг выгрузки")

                // setTimeout(addOutboundFeatures, 3000)

                // Анти-упаковка
            // try_to_do(createAntiPackingCheck, 50, 100, "Вставка галочки Антиупаковки")

                // Крупнее парочка элементов
            //  try_to_do(make_outbounds_bigger, 50, 100, "Увеличение мелких элементов")

                // Кнопка для перетаскивания KTЯ в левую часть
            //  if (_ls.get("sendKTAAppear", false)) try_to_do(add_sendKTA_button, 50, 100, "КТЯ перетаскиватор")

                try_to_do(function() {
                    if (cUrl == "https://turbo-pvz.ozon.ru/orders") {
                        document.regexClassSelector(/ozi__informer__informer_/).style.display = "none"
                        document.querySelector(`[data-testid="searchInput"]`).placeholder = "Отсканируйте или введите ШК клиента из OZON"
                    }
                })
                // Анти-реклама
                // if (_ls.get("hide_ads", false)) try_to_do(remove_ads, 100, 150, "Удалить рекламу")

            }
        }, 500)

        var KTAinterval = null
        function addOutboundFeatures() {
            if (cUrl.startsWith("https://turbo-pvz.ozon.ru/outbound?id=") && !cUrl.includes("id=-")) {
                let button_container = document.regexClassSelectorAll(/ozi__informer__informer__/).filter( e => e.innerText.includes("Добавьте"))[0]
                button_container.style.padding = "12px 10px"
                button_container.firstElementChild.style.fontWeight = "bold"
                button_container.firstElementChild.style.textAlign = "center"

                // button_container.innerHTML = `<h3 style="text-align: center; font-weight: bold; color: black;">Добавьте содержимое в перевозку</h3>`
                let target_node = document.createElement("div")
                target_node.style.display = "flex"
                target_node.classList.add("z_out_actions")

                // Увеличить картинки и числа
                function make_outbounds_bigger() {
                    let preview_images = document.regexClassSelectorAll(/_groupContainer_/)[1].querySelectorAll("img")
                    preview_images.forEach((e) => {
                        if (e.src.includes("svg")) return
                        e.style.width = "96px"
                        e.style.height = "96px"
                        e.src = e.src.replace("c50", "c100")
                    })
                    if (preview_images.length == 0) throw "Нечего увеличивать"

                    document.regexClassSelectorAll(/_address_/).forEach((e) => { e.style.fontSize = "18px" })
                    document.regexClassSelectorAll(/_flowType_/).forEach((e) => { e.style.fontSize = "18px" })
                    return "OK"
                }
                setTimeout(function() { try_to_do(make_outbounds_bigger) }, 700)

                let unsentKTA = document.regexClassSelector(/_outboundCommander_/).regexClassSelectorAll(/_block_/)[1].regexClassSelectorAll(/_itemsElement_/).filter( e => e.innerText.includes("КТЯ"))
                // Добавить кнопки
                if (target_node !== undefined) {
                    // - Анти упаковка
                    if (!document.isHave(".z_anti_box")) {
                        let _check = make_an_image_checkbox("Упаковки не нужны", `
                                <g style="pointer-events:none" stroke="#005bff" fill="none" stroke-width="15px" stroke-linejoin="round" stroke-linecap="round">
                                    <path d="M 67 110 l -56 -24 l 185 -80 l 185 80 l -185 80 l -57 -25 M 197 166 v 240 l 110 -47 M 197 405 l -187 -79 v -240 M 383 87 v 157 M 229 310 l 47 -20 M 228 342 l 74 -31 M 350 296 l 62 61"/>
                                    <path d="M 256 31 l -182 79 v 113 l 31 -17 l 34 48 v -114 l 183 -78 M 411 295 l -62 62"/>
                                    <circle cx="381" cy="326" r="80"/>
                                </g>`, true, 469, 412, 48, 42)
                        _check.classList.add("z_anti_box")
                        _check.style.margin = "2px 10px 0px 0px"
                        if (_ls.get("anti_packing", false)) click_on(_check)
                        target_node.appendChild(_check)
                    }

                    // Перенести КТЯ в возврат
                    if (!document.isHave(".z_sendKTA") && unsentKTA.length > 0 && _ls.get("sendKTAAppear", false)) {
                        let _sender = make_a_button(
                            `<svg viewBox="0 0 720 412" width="64" height="42" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                                <title>Перенести все КТЯ в возврат</title>
                                <g stroke="white" fill="none" stroke-width="15px" stroke-linejoin="round" stroke-linecap="round">
                                    <path d="M 397 110 l -56 -24 l 185 -80 l 185 80 l -185 80 l -57 -25 M 527 166 v 240 l 184 -80 v -240 M 527 405 l -187 -79 v -240 M 559 310 l 47 -20 M 558 342 l 74 -31 M 680 296"/>
                                    <path d="M 586 31 l -182 79 v 113 l 31 -17 l 34 48 v -114 l 183 -78"/>
                                    <path d="M 290 180 l 30 -30 h -180 l 50 -70 l -180 120 l 180 120 l -50 -70 h 180 l -30 -30"/>
                                </g>
                            </svg>`
                            , true, () =>{
                        KTAinterval = setInterval(() => {
                            simulateHTML5DragDrop(unsentKTA[0], document.regexClassSelector(/_itemsContainer_/))
                            unsentKTA = document.regexClassSelector(/_outboundCommander_/).regexClassSelectorAll(/_block_/)[1].regexClassSelectorAll(/_itemsElement_/).filter( e => e.innerText.includes("КТЯ"))
                            if (unsentKTA.length == 0) clearInterval(KTAinterval)
                        }, 500)
                        })
                        _sender.setAttribute("style", "display: table-cell;  padding: 1px 6px; font: menu;")
                        _sender.classList.add("z_sendKTA")
                        target_node.appendChild(_sender)
                    }
                }
                button_container.appendChild(target_node)
                return "OK"
            }
            return "CANCELLED"
        }

        function remove_ads() {
            let _item_to_remove = document.regexClassSelector(/_carousel_/)
            let _class = Array.from(_item_to_remove.classList).find(e => e.includes("_carousel_"))
            let hide_ad_list = _ls.get("ads_list", [])
            if (!hide_ad_list.includes(_class)) {
                hide_ad_list.push(_class)
                _ls.set("ads_list", hide_ad_list)
                document.querySelector('._z_style_').innerHTML = _custom_style.format(`.${hide_ad_list.join(", .")} {display:none}`)
            }
        }
        function return_ads() {
            document.querySelector('._z_style_').innerHTML = _custom_style.format("")
        }

        function calculateUnpaidItems() {
            if (isOn(/orders\/session\/\d+/) && !cUrl.includes("summary")
                // && !document.isHave(".z_check_all")
            ) {
                let all_items = document.regexClassSelectorAll(/_money_/)
                let paid_items = document.regexClassSelectorAll(/_price_/)
                let need_to_pay = all_items.filter(element => !paid_items.includes(element))
                let unpaid_items = need_to_pay.length
                let inpaid_sum = 0
                need_to_pay.forEach(e => {
                    inpaid_sum += Number(e.innerText.replace(" ₽", "").replace(",", ".").replace("&nbsp;", ""))
                });
                console.log(unpaid_items)
                console.log(inpaid_sum, "RUB")
                return "OK"
            }
            return "CANCELLED"
        }

        // Создать Возвратный и Прямой потоки
        function createOutboundButtons() {
            if (isOn(/outbound\?id=\-1001/) && !document.isHave('.z_create_outbounds')) {
                let container = document.regexClassSelector(/_element_/)
                let my_buttton_container = document.createElement("div")
                my_buttton_container.classList.add("z_create_outbounds")

                let button1 = make_a_button("Создать Возвратный поток", false, async () => {
                    click_on(document.regexClassSelector(/_element_/))
                    let go_forward = await try_to_do(() => { click_on(Array(...document.querySelectorAll(`[data-popover-reference="true"]`)).filter(e => e.innerText.includes("Направление"))[0]) }, 50, 200, "Нажать стрелочку")
                    if (go_forward) { go_forward = await try_to_do(() => { click_on(document.regexClassSelector("_dropdown__wrapper_").children[0]) }, 50, 200, "Выбрать Возврат") }
                    if (go_forward) { go_forward = await try_to_do(() => { click_on(Array(...document.querySelectorAll("button")).filter(e => e.innerText == "Создать")[0]) }, 50, 200, "Подтвердить") }
                })
                button1.classList.add("z_button_function")
                button1.setAttribute("style", "margin-bottom: 4px")

                let button2 = make_a_button("Создать Прямой поток", false, async () => {
                    click_on(document.regexClassSelector(/_element_/))

                    let go_forward = await try_to_do(() => { click_on(Array(...document.querySelectorAll(`[data-popover-reference="true"]`)).filter(e => e.innerText.includes("Направление"))[0]) }, 50, 200, "Нажать стрелочку")
                    if (go_forward) { go_forward = await try_to_do(() => { click_on(document.regexClassSelector("_dropdown__wrapper_").children[1]) }, 50, 200, "Выбрать Возврат") }
                    if (go_forward) { go_forward = await try_to_do(() => { click_on(Array(...document.querySelectorAll("button")).filter(e => e.innerText == "Создать")[0]) }, 50, 200, "Подтвердить") }
                })
                button2.classList.add("z_button_function")

                my_buttton_container.appendChildren(button1, button2)
                container.appendChild(my_buttton_container)
                return "OK"
            }
            return "CANCELLED"
        }

        // Кнопка "Всё на проверку"
        function createCheckAllButton() {
            if (isOn(/orders\/session\/\d+/) && !cUrl.includes("summary") && !document.isHave(".z_check_all")) {
                let check_count = document.querySelectorAll(`[data-testid="btnToCheck"]`).length
                let check_all = make_a_button("На проверку всё", true, () => {
                    Array(...document.querySelectorAll(`[data-testid="btnToCheck"]`)).filter(element => /Проверить/.test(element.innerHTML)).forEach(element => click_on(element) )
                    check_all.style.opacity = 0.3
                })
                check_all.classList.add("z_check_all")
                check_all.setAttribute("style", "padding: 0 10px; line-height: 43px;")
                if (check_count == 0) { check_all.style.opacity = 0.3 }
                document.regexClassSelector(/ozi__filter-chip-group__filterChipGroup__/).appendChild(check_all)
                return "OK"
            }
            return "CANCELLED"

        }

        // Процесс автовыдачи
        async function execute_auto_end() {
            let _go_forward = await try_to_do(() => {
                click_on(Array.from(document.querySelectorAll(`[data-testid="giveOutActionButton"]`)).filter(element => element.innerHTML.includes("Продолжить"))[0])
            })
            if (_go_forward) {
                _go_forward = await try_to_do(() => {
                    click_on(Array.from(document.querySelectorAll(`[data-testid="giveOutActionButton"]`)).filter(element => />Выдать<|>Аннулировать<|>Провести оплату</.test(element.innerHTML))[0])
                }, 50, 300, "Выдать")
            }

            if (_go_forward) {
                _go_forward = await try_to_do(() => {
                    click_on(Array.from(document.regexClassSelectorAll(/ozi__button__button__/)).filter(element => element.innerHTML.includes("На главную"))[0])
                }, 50, 300, "На главную")
            }

        }

        // Кнопка "Выдать всё"
        function createAutoGivingButton() {
            if (isOn(/orders\/session\/\d+/) && !cUrl.includes("summary") && !document.isHave(".z_auto_give")) {
                let div = document.regexClassSelector(/_payment_/)
                let button = make_a_button("<p>Выдать <u><b>в один клик</b></u></p>", true, execute_auto_end)
                button.classList.add("z_auto_give")
                div.appendChild(button)
                return "OK"
            }
            return "CANCELLED"
        }

        // Назвать количество товаров к выдаче
        function tellItemAmount() {
            return "CANCELLED"
            if (isOn(/orders\/session\/\d+/)) {
                let all_tags = document.regexClassSelectorAll(/_tags_/).filter(i => !i.getAttribute("class").includes("badges"))
                if (all_tags.length == 0) throw "иди нахуй"

                let texts = uniques(all_tags.map(i => {
                    let tag = i.regexClassSelector(/_badge__label_/)
                    if (tag) return i.regexClassSelector(/_badge__label_/).innerText
                    return null
                }))

                // Пломба
                let _wait = 3000
    console.log(texts)
                let is_post_payment = texts.includes("Требуется оплата")
                let is_ozon_bank = texts.includes("Ozon Банк")
                let is_do_not_unpack = false
                let is_specific_conditions = false

                if (is_post_payment) _wait += 1500
                if (is_ozon_bank) _wait += 2000
                if (is_do_not_unpack) _wait += 1000
                if (is_specific_conditions) _wait += 2000
                print_message({header: "Теги", status: "LOG", tries:0, name:texts.join(", ") + "| Ожидание: " + _wait + "мс", template:"{0}"})

                return "OK"
            }
            return "CANCELLED"

            if (isOn(/orders\/session\/\d+/) && !document.isHave(".z_check_all")) {
                setTimeout(() => {
                    let items_count = document.regexClassSelector(/_postings_/).children.length
                    let items_string = "товаров"
                    if (items_count % 10 === 1 && items_count % 100 !== 11) { items_string = 'товар' }
                    else if ((items_count % 10).between(2, 4, true) && (!(items_count % 100).between(10, 20, true))) { items_string = 'товара'; }

                    nigga_say(`${items_count} ${items_string}`)

                    return "OK"
                }, _wait)
            }
            return "CANCELLED"
        }



        var timer_active = false
        function createSettingsMenu() {
            if (cUrl == "https://turbo-pvz.ozon.ru/orders") {

                let target = document.regexClassSelector(/_searchBlock_/)
                let settingsContainer = document.createElement("div")
                settingsContainer.classList.add("z_settings_container")

                let settingsInnerContainer = document.createElement("div")
                settingsInnerContainer.id = "settings_inside"

                let header = document.createElement("div")
                header.style.display = "flex"
                header.style.justifyContent = "space-between"
                header.innerHTML = `<p class="z_setting_header">Настройки:</p>`

                let _expander = make_a_button(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path id="setting_arrow" fill="currentColor" d="M 4 12 L 12 20 L 20 12"/>
                            </svg>
                        `, false, () => {
                    let target = document.querySelector("#settings_inside")
                    let state = target.style.height == "0px"

                    target.style.height = state ? "240px" : "0px"
                    document.querySelector("#setting_arrow").setAttribute("d", state ? "M 4 12 L 12 4 L 20 12" : "M 4 12 L 12 20 L 20 12")
                })
                _expander.style.padding = "0px 10px"
                header.appendChild(_expander)

                // График рабочего дня

                let time_section = document.createElement("div")
                time_section.classList.add("setting_category")
                time_section.style.gridArea = "1/1"
                time_section.innerHTML = `<p class="z_setting_header group_header">График рабочего дня</p>`

                let start_job = document.createElement("p")
                start_job.id = "start_day"
                start_job.innerHTML = `Начало рабочего дня`
                let start_job_i = document.createElement("input")
                start_job_i.type = "time"
                start_job_i.value = _ls.get("start_job")
                start_job_i.style.marginLeft = "5px"
                start_job_i.onchange = function() {
                    _ls.set("start_job", start_job_i.value)
                }
                start_job.appendChild(start_job_i)


                let end_job = document.createElement("p")
                end_job.id = "end_day"
                end_job.innerHTML = `Конец рабочего дня`
                let end_job_i = document.createElement("input")
                end_job_i.type = "time"
                end_job_i.value = _ls.get("end_job")
                end_job_i.style.marginLeft = "5px"
                end_job_i.onchange = function() {
                    _ls.set("end_job", end_job_i.value)
                }
                end_job.appendChild(end_job_i)

                time_section.appendChildren(start_job, end_job)

                // Часы

                let timer_section = document.createElement("div")
                timer_section.classList.add("setting_category")
                timer_section.style.gridArea = "1/2"
                timer_section.innerHTML = `<p class="z_setting_header group_header">Отображение часов</p>`

                let time_last = make_a_checkbox("До конца рабочего дня", true)
                let time_now  = make_a_checkbox("Сейчас", true)
                let time_hide = make_a_checkbox("Скрыть", true)

                let _time_set = function(last = true, now = false, hide = false) {
                    if (time_last.is_active()) check_switch(time_last.lastElementChild)
                    if (time_now.is_active()) check_switch(time_now.lastElementChild)
                    if (time_hide.is_active()) check_switch(time_hide.lastElementChild)

                    if (!timer_active) click_on(document.querySelector(".timer_activator"))

                    if (last) { check_switch(time_last.lastElementChild) }
                    if (now) { check_switch(time_now.lastElementChild) }
                    if (hide) { check_switch(time_hide.lastElementChild) }

                    _ls.set("time_until_end", time_last.is_active())
                    _ls.set("time_now", time_now.is_active())
                    _ls.set("time_hide", time_hide.is_active())
                    _ls.set("time_show_percent", time_percent.is_active())
                    timer_update()
                }

                time_last.lastElementChild.addEventListener("click", () => { _time_set(true, false, false) })
                time_now.lastElementChild.addEventListener("click", () => { _time_set(false, true, false) })
                time_hide.lastElementChild.addEventListener("click", () => { _time_set(false, false, true) })

                let time_percent = make_a_checkbox("Показать процент", true)

                if (_ls.get("time_until_end", false)) check_switch(time_last.lastElementChild)
                if (_ls.get("time_now", false)) check_switch(time_now.lastElementChild)
                if (_ls.get("time_hide", false)) check_switch(time_hide.lastElementChild)
                if (_ls.get("time_show_percent", false)) check_switch(time_percent.lastElementChild)

                time_percent.lastElementChild.addEventListener("click", () => { _time_set(time_last.is_active(), time_now.is_active(), time_hide.is_active()) })

                timer_section.appendChildren(time_last, time_now, time_hide, time_percent)

                // Синтез речи

                let tts_section = document.createElement("div")
                tts_section.classList.add("setting_category")
                tts_section.style.gridArea = "2/2 span"
                tts_section.innerHTML = `<p class="z_setting_header group_header">Синтез речи</p>`

                let say_amount = make_a_checkbox("Продиктовать количество товаров", true)
                if (_ls.get("tell_amount", false) == true) { check_switch(say_amount.lastElementChild)}
                say_amount.lastElementChild.addEventListener("click", () => _ls.set("tell_amount", say_amount.is_active()))

                let say_wrong_adress = make_a_checkbox("Продиктовать адресс (ошиблись ПВЗ)", true)
                if (_ls.get("another_castle", false) == true) { check_switch(say_wrong_adress.lastElementChild)}
                say_wrong_adress.lastElementChild.addEventListener("click", () => _ls.set("another_castle", say_wrong_adress.is_active()))

                let say_unpaid_items = make_a_checkbox("Продиктовать информацию о неоплаченных товаров", true)
                if (_ls.get("tell_unpaid_info", false) == true) { check_switch(say_unpaid_items.lastElementChild)}
                say_unpaid_items.lastElementChild.addEventListener("click", () => _ls.set("tell_unpaid_info", say_unpaid_items.is_active()))

                tts_section.appendChildren(say_amount, say_wrong_adress, say_unpaid_items)

                // Отладка

                let plugin_popup_section = document.createElement("div")
                plugin_popup_section.classList.add("setting_category")
                plugin_popup_section.style.gridArea = "2/1"
                plugin_popup_section.innerHTML = `<p class="z_setting_header group_header">Отладка</p>`

                let popup_check = make_a_checkbox("Всплывающие сообщения", true)
                popup_check.lastElementChild.addEventListener("click", () => {
                    if (_ls.get("popups", false)) {
                        print_message({header:"Всплывашка", status:"OK", tries:0, name:"", template:"Пока :("})
                    }
                    _ls.set("popups", popup_check.is_active())
                    if (_ls.get("popups", false)) {
                        print_message({header:"Всплывашка", status:"OK", tries:0, name:"", template:"Привет :)"})
                    }
                })
                if (_ls.get("popups", false)) { check_switch(popup_check.lastElementChild) }
                let warn_ignore = make_a_checkbox("Фильтровать предупреждения", true)
                warn_ignore.lastElementChild.addEventListener("click", () => { _ls.set("ignore_cancel_popup", warn_ignore.is_active())})
                if (_ls.get("ignore_cancel_popup", false)) { check_switch(warn_ignore.lastElementChild) }

                plugin_popup_section.appendChildren(popup_check, warn_ignore)

                let other_section = document.createElement("div")
                other_section.classList.add("setting_category")
                other_section.style.gridArea = "1/3"
                other_section.innerHTML = `<p class="z_setting_header group_header">Прочее</p>`


                let no_ad = make_a_checkbox("Рекламный баннер", true)
                if (_ls.get("hide_ads", false)) { check_switch(no_ad.lastElementChild) }
                no_ad.lastElementChild.addEventListener("click", () => {
                    _ls.set("hide_ads", !no_ad.is_active())
                    if (_ls.get("hide_ads")) remove_ads()
                    else return_ads()
                })

                let useKTASender = make_a_checkbox("Кнопка для авто КТЯ", true)
                if (_ls.get("sendKTAAppear", false)) { check_switch(useKTASender.lastElementChild) }
                useKTASender.lastElementChild.addEventListener("click", () => {
                    _ls.set("sendKTAAppear", useKTASender.is_active())
                })
                other_section.appendChildren(no_ad, useKTASender)

                settingsContainer.appendChild(header)

                settingsInnerContainer.appendChildren(time_section, timer_section, plugin_popup_section, tts_section, other_section)

                settingsContainer.appendChild(settingsInnerContainer)
                target.appendChild(settingsContainer)
                return "OK"
            }
            return "CANCELLED"
        }

        // Вставить таймер в шапку
        function createTimer() {
            if (!document.isHave(".timer_activator")) {
                let _timer_container = document.createElement("div")
                _timer_container.style.display = "grid"

                let _activator = document.createElement("span")
                _activator.classList.add("timer_activator")
                _activator.innerText = "< ⏱"

                _activator.onclick = () => {
                    timer_active = !timer_active
                    document.querySelector(".z_timer").style.width = timer_active ? "256px" : "0px"
                    document.querySelector(".timer_activator").innerText = timer_active ? "⏱ >" : "< ⏱"
                    _activator.style.borderRadius = timer_active ? "5px 0px 0px 5px" : "5px 5px 5px 5px"
                    _activator.style.backgroundImage = timer_active ? "linear-gradient(to right, #fff 80%, black)" : ""
                }

                let ass = document.createElement("div")
                ass.classList.add("z_timer")

                let time_output = document.createElement("p")
                time_output.classList = "z_timer_text"
                time_output.innerHTML = "Осталось ??ч ??м ??с"

                let percent = document.createElement("p")
                percent.classList = "z_timer_percent"
                percent.innerHTML = "??.??%"

                ass.appendChildren(time_output, percent)
                _timer_container.appendChildren(_activator ,ass)

                document.regexClassSelector(/ozi__header__rightContent__/).prepend(_timer_container)
                return "OK"
            }
            return "CANCELLED"
        }

        function timer_update() {
            if (timer_active) {
                // Получаем текущее время
                if ([String(workStart.getHours()).padStart(2, "0"), String(workStart.getMinutes()).padStart(2, "0")].join(":") != _ls.get("start_job", "09:00")) {
                    workStart.setHours(..._ls.get("start_job", "09:00").split(":").map(Number), 0, 0)
                }
                if ([String(workEnd.getHours()).padStart(2, "0"), String(workEnd.getMinutes()).padStart(2, "0")].join(":") != _ls.get("end_job", "21:00")) {
                    workEnd.setHours(..._ls.get("end_job").split(":").map(Number), 0, 0)
                }
                const now = new Date();
                let [timerLeft, timerRight] = [document.querySelector(".z_timer_text"), document.querySelector(".z_timer_percent")]
                timerLeft.style.display = (_ls.get("time_hide", false) ?  "none" : "block")
                timerRight.style.display = (_ls.get("time_show_percent") ? "block" : "none" )
                let not_started = "Работа не началась"
                let ended = "Дело сделано"

                const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
                let _today = `{0}-{1}-{2}`.format(now.getDate(), months[now.getMonth()], now.getFullYear())
                let time_now = _today + ` | {0}`
                let time_last = _today + ` | -{0}`
                let totalWorkTime = workEnd - workStart; // Общее время работы в миллисекундах
                let elapsedTime = now - workStart; // Прошедшее время в миллисекундах
                let percentageElapsed = Math.max(0, Math.min((elapsedTime / totalWorkTime) * 100, 100));
                if (_ls.get("time_until_end")) {
                    if (now < workStart) { timerLeft.innerHTML = not_started }
                    else if (now > workEnd ) { timerLeft.innerHTML = ended }
                    else {
                        let remainingTime = workEnd - now; // Оставшееся время в миллисекундах
                        // Преобразуем оставшееся время в часы и минуты
                        let remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
                        let remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                        let remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                        let _output = []
                        if (remainingHours > 0) _output.push(remainingHours)
                        if (remainingMinutes > 0) _output.push(remainingMinutes.toString().padStart(2, "0"))
                        if (remainingSeconds > 0) _output.push(remainingSeconds.toString().padStart(2, "0"))

                        timerLeft.innerHTML = time_last.format(_output.join(":"))
                    }
                } else if (_ls.get("time_now")) {
                    let _output = []
                    if (now.getHours() > 0) _output.push(now.getHours())
                    if (now.getMinutes() > 0) _output.push(now.getMinutes().toString().padStart(2, "0"))
                    if (now.getSeconds() > 0) _output.push(now.getSeconds().toString().padStart(2, "0"))
                    timerLeft.innerHTML = time_now.format(_output.join(":"))
                }

                timerLeft.style.display = _ls.get("time_hide") ? "none" : "block"

                timerRight.innerHTML = `${percentageElapsed.toFixed(2)}%`
                timerRight.style.display = _ls.get("time_show_percent") ? "block" : "none"
                document.querySelector(".z_timer").style.backgroundSize = `${percentageElapsed.toFixed(2)}%, auto`
            }
        }

        var _time_tick = null
        function activateTimer() {
            if (_time_tick != null) return "CANCELLED"

            _time_tick = setInterval(timer_update, 1000) // Автообновление таймера
            return "OK"

        }

        // WIP
        window.addEventListener("keydown", (event) => {
            if (event.key == "=") {
                let selection = window.getSelection().toString()
                console.log(selection)
                nigga_say(selection)
            } else if (event.key == "+") {
                enterSHK("ii11807135000")
            }
        })
        console.log("Extra utilities initialization completed!")
        // Your code here...
    })();
