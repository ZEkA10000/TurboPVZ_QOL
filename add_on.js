
// ==UserScript==
// @name         Turbo PVZ Extra Utilities
// @namespace    http://tampermonkey.net/
// @version      0.1.103
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
            /*@keyframes rip_ad {
                from {
                    height: 164px;
                    opacity: 1
                }
                to {
                    height: 0px;
                    opacity: 0
                }
            }
            @keyframes unrip_ad {
                to {
                    height: 164px;
                    opacity: 1
                }
                from {
                    height: 0px;
                    opacity: 0
                }
            }*/
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

    // function add_ad_hider(...classes) {
    //     if (document.body.isHave(".z_ad_hider")) return "CANCELLED"
    //     let s =  document.createElement("style")
    //     s.innerHTML = `.${classes.join(", .")} {display:none}`
    //     s.classList.add("z_ad_hider")
    //     document.body.appendChild(s)
    // }
    // function remove_ad_hider() {
    //     document.querySelector(".z_ad_hider").remove()
    // }

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


    const blackListedHost = "httpas://st.ozone.ru/s3/turbo-pvz-ui-bucket/mp3/"


    function replaceSound(url) {
        let funnySounds = {
            'error': "data:audio/mpeg;base64,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",
            "success": "data:audio/mpeg;base64,SUQzBAAAAAABKFRYWFgAAAASAAADbWFqb3JfYnJhbmQAaXNvbQBUWFhYAAAAEwAAA21pbm9yX3ZlcnNpb24ANTEyAFRYWFgAAAAkAAADY29tcGF0aWJsZV9icmFuZHMAaXNvbWlzbzJhdmMxbXA0MQBUUEUxAAAAFAAAAyB8IEJ5IFg5IENvbnZlcnRlcgBUU1NFAAAADwAAA0xhdmY1OC40OC4xMDAAAAAAAAAAAAAAAP/7kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAAYwAAo0IABQcKDA8RFBcZHB4hIyYoKy4wMzU4Oj0/QkVHSkxPUVRXWVxeYWNmaGtucHN1eHp9gIKFh4qMj5GUl5mcnqGjpqirrrCztbi6vcDCxcfKzM/R1NfZ3N7h4+bo6+7w8/X4+v3/AAAAAExhdmM1OC45NgAAAAAAAAAAAAAAACQDQAAAAAAAAKNCGKP4WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kmRAj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkQI/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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IMjgUtFjs0e+DpFO5cyMjImv/LKyhgThmsU6maxT/ZqFhGZSAhdn///////1iypMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+5Bk+4RkVWg1C2M/IE/tBxA8wloOeaKdDSRRyO+L1SGAjdiqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=",
            "warning": "data:audio/mpeg;base64,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WJlOi5qWJiUjoQoKItKiGdsemG8FRreQPci2AAAAABYgAAHPyvhSXq5JiAssiQMCyaI4plsaHn7DdBqv8UB//zV6ejGvX3J//sqsmGiGIQAAAm6SPJNGQWArTfZnKzShywxtnb2VWOMSC443CpBzEhfXjag0Z4u7wZYjJheaG7zapHbfi5+O5Ydr/UAcr5+8YoDrNkuz7P4ggVeZcXFbFvvPUdLieVLicoeYXQMk6kUckSZ+QeXQtFXyhOO7ealaBFCpLLPY1MTW20HeZFs3N7XwEqCc2v4gQsZZO2xfgqdz/2t/ITxV++QmyfQQ4lPrdDUKUTopcvFQ4sp8Wjhv////Cl93/8v90f5jf979P5ZGiJmr68rqYxAAACQmSijkCQikKUz02dL5LKFSkxVbWpr/+5JkDwHUJV1W8eZEYjMsegwALZoShXVTx7DegLux54wCnpKTTqXH5VR++48vjQb/zkGyT1PCNo5abulnCqX3Bh5cezz+g5QofZw1QVB+OHP5yeMfg12HnDKtR2+kByMLIDo4RqCcRRedktoj9qWZdG4aJO20MqEeDZr1/0GDMuSSRMlFKbZbrLxYAAAAFrsAO/kGJ/YiZM5f+Qv8+T//IobQj3x6nlo///////av//////+m5wS0T4srLXhWrqLqWQyQAaUcvJrkuMBaaFWtlwMU1GZggywJXsJ6+rPDxEpLh7LLa+fmWns3JtZbane/isD5zerNJr5Yfi1ITN4op00X7VkLGNzwnb1L5oOqdT8VbZT72e+yyOsLrfUbjjchmsJ08aroi24Kro72detbuta1r72xW2FRVuiS2WbtlTZqr5GGeRISj8jvnELWxJVMS0AD68QKLyDQf1A5yl//////wqPC05oEm//////6uhhqt6DQx//////49UjNEV+qqburh0IwAAAC54ESHcKzwPi6OpyL2x8HAfGTfuicix+5//uSZBCD9HZa1XGPTwIxqcnjAgekkVlVV8ewz8jFJubADCrIxa9rMQNdBMX06iR1psQ5KBt37HDAydvpiwXCx8DENoAZqdzSnifVWBgN1Z1EWo9czUiIkY1tOiie3C8p/UUnMVtwiljycF6UEdV8Lrqvv7933OPUhrv9dLNSztqk+XOUeKv/cp7sk5sTyXfrTfKAAAAPvyBoGQsBMDSIGf5wT4gVxe//////1HSJbZ//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4nIDVDgDhcswdOjxhy/qn9t2dacpOlwwpT/XIoAfTf1b//+nr////IgtjUdX//qQERMQmHiLBQSG//+h////////+CoSBMMfQ8i9dt3ZupgAQmylJ8OwZY3kWT0lb0etGyJprRK+zRF3WHvwmT41uJ8+L2ds+ZK5gWfhGkdn1xP9KWvqFxAgq7MrIbdCl2KqrM1SmUk6p877rY4wcSgaHowQhsf//9/3mgfYUTJzEWsErerac7Qdb/93/xzltnUBVEBsawHeShFYPyf/////9Jnn2PPCYHxf//6iaYygaPtf+qcdG7lzijf/////9evYdEkxqDusq5pFQgAAACJVKXKcW49BMlOXxoTD1JISpVpUx9yODXhsbo0GDhupiFPK1Qo3ebf308ahekuv7Z19I98z+dTLAi3bLTKm7m81KrThm2YrX3Shark2ptlsGL5eiDS5CF/XfzPbpl/XDR5i05NCZR8SQnFp2UNU44039F/R/fel//uSZD+C9B5dVXHrPsAwTGoQAOK4EI2HU8etXoDDsahAA4rwS2SKiqvOJnEwMEUZ//////m5fUZQsQUbDP//+od1DhRzG//hQQCQK7f/////3nbjRzxnvcmNvcxXMRAE+lcSdHGkttpWL5eCdpxdOzsdqKXMBsZp/GfZktifUTect3tmsSWC+KIW085IV6wcVpf///sU6HDapaHnMW9K5/vdpwnUXMXGdhlNpvcxF5/slmwrg6330zbPPMOezgp6Nj6qCiwiQ6SKVQ4mKoVMb/Yv6P+mk5TWrNl4fN0dSYeVCASXGf/////5KKBnKmRLqJ2///RR80yKDf/+aHDwHgRW//////lg20WAJBdq1XnJmEdRIBAAZZ3MyTIMYw+lziJsuIyWOYvEVSMkjex0rHgZgxMv8//bnmWzNOudJwdIEYcg1UilOIqVq6JVmgb6jUmm2gkdnnaVOr+JNtkXGGKItXQyUNE0lhCCAbaXuK8ye30j5QUYYSIpAdIA8PgAqx2bJLSvz//A////j/+v/i/s5YAoAAHUbIUOHQo3/t9////7kmRJgNQhYlPx8EYgL8xKIwDluE9Rc0/HrLsAzK7nzACqgv8tPL8io0I2f//850Iphgq//9AKURR1//////327xotHTkbVqxmQAAEP5EE2f1J+U5NyeMSIXlYjz9RsBl9stfgzNuX1Y9q5xjU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hq6lgJQWuQzSeA+RBUhSEGUQUCGXJnKkcYAFMVxZxcoVWAyKncczgTRByRJKkRqJE4MEvoRuGQpBWgCQjGpM1WKTGqxqxqTHVi7GpRq2pMarBKARhSDCgYqqTGqxYxhSDCgYqgKARhRIYBgE4CMGFBQKgKAQoKA3KWzKZDLmQs1iwiCASGchfJL5FJyy2KpDLQ3RMwQAMzHAxVcq2ggJiGkU16XS5PUsyCBnLp6mqJE1dKCViAFAWWM7jihVQ0uAVlpmAoOK/jdy0qyzQ83FXoX+MaANJo7DC7rJASAskWSLTAEhnIARGJKLJdZa5kqeKgKrLC4TJXSSqMKAM5kzhJDOdDyCE2XPVQiMpL2oUu0sEs5OVIllsVjzlO9ecJYYusWueaJSKGZdMkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uSZP+N9h5rMwgBxqIAAA0gAAABHb2yxCGPGogAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgBzI+mZGRbQjIzKmEjrNyUVk0k04Tc0hWVSWTUXYezKKqyaS8NzZRlcJ5sYokKxU4XKLrqTc0hWVWWVSTUXUnBJNK4ThuMtISIhGg+MDYyHjpRGw9lqSqyagYORA1UQfUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kmRwj/L9ZZyIAU8SAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV7fQ=="
        }
        let type = url.replace(blackListedHost, "").replace(".mp3", "")
        console.log(type)
        if (type in funnySounds) {
            return funnySounds[type]
        } else {
            return url
        }
    }

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes(blackListedHost)) {
            console.log(`Блокировка загрузки через fetch: ${url}`);
            return Promise.reject(new Error('Блокировка загрузки с этого домена'));
        }
        return originalFetch.apply(this, args);
    };

    const originalXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes(blackListedHost) && url.includes("error")) { // Замените 'example.com' на домен, который вы хотите заблокировать
            arguments[1] = replaceSound(url)
            return originalXMLHttpRequestOpen.apply(this, arguments);
        }
        return originalXMLHttpRequestOpen.apply(this, arguments);
    };

    // Строка для хранения перехваченного ШК
    var scannedData = '';
    // Технический таймер обнудения строки
    var timer;
    // Задержка в миллисекундах
    const delay = 1000;

    // Перехват сканера
    document.addEventListener('keydown', async (event) => {
        if (event.key == "Enter") {
            console.log("Enter нажат")
            if (cUrl == "https://turbo-pvz.ozon.ru/orders" && _ls.get("another_castle", false)) {
                let full_adress = document.regexClassSelector(/_businessSection_/).lastElementChild.lastChild.wholeText.split(",")
                let adress = full_adress.slice(-3).join("").trim()
                let progress = try_to_do(() => nigga_say(`Заказ клиента находится по адресу: ${adress}`, true), 50, 100, "Ваша принцесса в другом замке")
                //if (progress) { clearTimeout(timer_for_wrong_adress) }
            }
            if (!isOn(/outbound\?id=\d+/)) {
                scannedData = '';
                return
            } else {
                console.log('Считанный штрих-код:', scannedData);
                scannedData = processScannedBarcode(scannedData); // Обрабатываем штрих-код
                console.log('Обработанный штрих-код:', scannedData);
                if (Boolean(document.querySelector(".z_anti_box")) && document.querySelector(".z_anti_box").is_active()) {
                    //alert(`Обработан штрих-код: ${scannedData}`);
                    let go_forward = await try_to_do( () => {
                        let _arr = document.regexClassSelectorAll(/ozi__radio__leftContent__/)
                        click_on(_arr[_arr.length - 1])
                    }, 50, 100, "Нажимаем кнопку. Упаковка не требуется")
                    if (go_forward) {
                        go_forward = await try_to_do( () => {
                            inputText(document.querySelector("[placeholder='Отсканируйте или введите вручную']"), scannedData)
                        }, 50, 100, "Вводим ШК. Упаковка не требуется")
                    }
                    if (go_forward) {
                        go_forward = await try_to_do( () => {
                            click_on(document.regexClassSelectorAll("ozi__button__content__").find(element => element.innerText == "Завершить"))
                        }, 50, 100, "Завершаем ввод. Упаковка не требуется")
                    }
                    scannedData = '';
                }
            }
        } else {
            if (event.key.match(/[0-9A-zА-я]/)) {
                scannedData += event.key
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
        print_message({header: "", status: "ERROR", tries: _max_attempts, name: comment, template: `Операция "{0}" вызывает ошибки! <br> Подробности в консоли...`})
        return false
    }

    function make_a_button(text, blue=false, callback=null) {
        const button = document.createElement("button");
        button.innerHTML = text;
        if (blue) {
            button.setAttribute('data-testid', 'giveOutActionButton')
            button.setAttribute("class", "ozi__button__button__5UTJi ozi__button__size-500__5UTJi ozi-body-500-true ozi__button__primary__5UTJi ozi__button__hug__5UTJi");
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

            // Анти-упаковка
            try_to_do(createAntiPackingCheck, 50, 100, "Вставка галочки Антиупаковки")

            // Крупнее парочка элементов
            try_to_do(make_outbounds_bigger, 50, 100, "Увеличение мелких элементов")

            // Кнопка для перетаскивания KTЯ в левую часть
            if (_ls.get("sendKTAAppear", false)) try_to_do(add_sendKTA_button, 50, 100, "КТЯ перетаскиватор")

            try_to_do(function() {
                if (cUrl == "https://turbo-pvz.ozon.ru/orders") {
                    document.regexClassSelector(/ozi__informer__informer_/).style.display = "none"
                    document.querySelector(`[data-testid="searchInput"]`).placeholder = "Отсканируйте или введите ШК клиента из OZON"
                }
            })
            // Анти-реклама
            // if (_ls.get("hide_ads", false)) try_to_do(remove_ads, 100, 150, "Удалить рекламу")

        }
    })

    function make_outbounds_bigger() {
        if (cUrl.startsWith("https://turbo-pvz.ozon.ru/outbound?id=") && !cUrl.includes("id=-")) {
            let preview_images = document.regexClassSelectorAll(/_groupContainer_/)[1].querySelectorAll("img")
            console.log(preview_images)
            preview_images.forEach((e) => {
                if (e.src.includes("svg")) return
                e.style.width = "96px"
                e.style.height = "96px"
                e.src = e.src.replace("c50", "c100")
            })
            if (preview_images.length == 0) throw "Нечего увеличивать"
            document.regexClassSelectorAll(/_address_/).forEach((e) => {
                e.style.fontSize = "18px"
            })
            return "OK"
        }
        return "CANCELLED"
    }
    var KTAinterval = null
    function add_sendKTA_button() {
        if (cUrl.startsWith("https://turbo-pvz.ozon.ru/outbound?id=") && !cUrl.includes("id=-")) {
            let unsentKTA = document.regexClassSelector(/_outboundCommander_/).regexClassSelectorAll(/_block_/)[1].regexClassSelectorAll(/_itemsElement_/).filter( e => e.innerText.includes("КТЯ"))
            let target_node = document.regexClassSelectorAll(/ozi__informer__informer__/).filter( e => e.innerText.includes("Добавьте"))[0]
            if (!document.isHave(".z_sendKTA") && target_node !== undefined && unsentKTA.length > 0) {
                let _sender = make_a_button("Отправить все КТЯ в возврат (тест)", true, () =>{
                KTAinterval = setInterval(() => {
                    simulateHTML5DragDrop(unsentKTA[0], document.regexClassSelector(/_itemsContainer_/))
                    unsentKTA = document.regexClassSelector(/_outboundCommander_/).regexClassSelectorAll(/_block_/)[1].regexClassSelectorAll(/_itemsElement_/).filter( e => e.innerText.includes("КТЯ"))
                    if (unsentKTA.length == 0) clearInterval(KTAinterval)
                }, 500)
                })
                _sender.setAttribute("style", "display: table-cell; padding: 10px; margin-top:5px")
                _sender.classList.add("z_sendKTA")
                target_node.appendChild(_sender)
                return "OK"
            }
            throw "Иди нахуй"
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
                let go_forward = await try_to_do(() => { click_on(document.regexClassSelector(/ozi__dialog__dialog__/).regexClassSelector(/ozi__input-select__rightContent__/)) }, 50, 200, "Нажать стрелочку")
                if (go_forward) { go_forward = await try_to_do(() => { click_on(document.regexClassSelector(/ozi__dropdown__wrapper__/).children[0]) }, 50, 200, "Выбрать Возврат") }
                if (go_forward) { go_forward = await try_to_do(() => { click_on(document.regexClassSelector(/_controlsRight_/).children[0]) }, 50, 200, "Подтвердить") }
            })
            button1.classList.add("z_button_function")
            button1.setAttribute("style", "margin-bottom: 4px")

            let button2 = make_a_button("Создать Прямой поток", false, async () => {
                click_on(document.regexClassSelector(/_element_/))
                let go_forward = await try_to_do(() => { click_on(document.regexClassSelector(/ozi__dialog__dialog__/).regexClassSelector(/ozi__input-select__rightContent__/)) }, 50, 200, "Нажать стрелочку")
                if (go_forward) { go_forward = await try_to_do(() => { click_on(document.regexClassSelector(/ozi__dropdown__wrapper__/).children[1]) }, 50, 200, "Выбрать Возврат") }
                if (go_forward) { go_forward = await try_to_do(() => { click_on(document.regexClassSelector(/_controlsRight_/).children[0]) }, 50, 200, "Выбрать Возврат")  }
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
            let button = make_a_button("<p>Выдать заказ <u><b>без пакетов</b></u></p>", true, execute_auto_end)
            button.classList.add("z_auto_give")
            div.appendChild(button)
            return "OK"
        }
        return "CANCELLED"
    }

    // Назвать количество товаров к выдаче
    function tellItemAmount() {
        return "CANCELLED"
        let _wait = 1500


        //_tags_1vf2o_54

        let is_post_payment = false        // Требуется оплата
        let is_ozon_bank = false           // Ozon Банк
        let is_do_not_unpack = false
        let is_specific_conditions = false

        if (is_post_payment) _wait += 1500
        if (is_ozon_bank) _wait += 2000
        if (is_do_not_unpack) _wait += 1000
        if (is_specific_conditions) _wait += 2000

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

    function createAntiPackingCheck() {
        if (cUrl.startsWith("https://turbo-pvz.ozon.ru/outbound?id=") && !cUrl.includes("id=-")) {
            let target_node = document.regexClassSelectorAll(/ozi__informer__informer__/).filter( e => e.innerText.includes("Добавьте"))[0]
            if (!document.isHave(".z_anti_box") && target_node !== undefined) {
                let _check = make_a_checkbox("Упаковка точно не требуется (тест)")
                _check.classList.add("z_anti_box")
                if (_ls.get("anti_packing", false)) check_switch(_check.firstElementChild)
                target_node.appendChild(_check)
                return "OK"
            }
            throw "Иди нахуй"
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
            let time_now = `Сейчас: {0}ч {1}м {2}c`
            let time_last = `Осталось: {0} {1} {2}`
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

                    timerLeft.innerHTML = time_last.format(
                        remainingHours   > 0 ? remainingHours   + "ч " : "",
                        remainingMinutes > 0 ? remainingMinutes + "м " : "",
                        remainingSeconds > 0 ? remainingSeconds + "c" : ""
                    )
                }
            } else if (_ls.get("time_now")) {
                timerLeft.innerHTML = time_now.format(now.getHours(), now.getMinutes(), now.getSeconds())
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
        }
    })
    console.log("Extra utilities initialization completed!")
    // Your code here...
})();
