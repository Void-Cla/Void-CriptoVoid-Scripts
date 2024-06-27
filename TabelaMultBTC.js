// ==UserScript==
// @name         Tabela de Rolagem do Multiply BTC
// @namespace    
// @version      0.1
// @description  
// @author       Sr.fox
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("Status: Multiply BTC Roll Counter Script loaded");

    let numRolls = 0;
    let numRollsTd = document.createElement('td');

    const stat = {
        1.25: {
            'hi': 8000,
            'lo': 2000,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td'),
        },
        2.0: {
            'hi': 9000,
            'lo': 1000,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td'),
        },
        4: {
            'hi': 7625,
            'lo': 2375,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td'),
        },
        8: {
            'hi': 8813,
            'lo': 1188,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td'),
        },
        19: {
            'hi': 9500,
            'lo': 500,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        34: {
            'hi': 9721,
            'lo': 279,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        64: {
            'hi': 9852,
            'lo': 148,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        128: {
            'hi': 9926,
            'lo': 74,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        256: {
            'hi': 9963,
            'lo': 37,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        512: {
            'hi': 9981,
            'lo': 19,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        4750: {
            'hi': 9998,
            'lo': 2,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        },
        8888: {
            'hi': 0,
            'lo': 0,
            'miss_hi': 0,
            'miss_lo': 0,
            'miss_hi_td': document.createElement('td'),
            'miss_lo_td': document.createElement('td')
        }
    };

    let div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:50px;left:0;background-color:white;';

    let table = document.createElement('table');

    let rollsTr = tableRollsRow();
    let headerTr = tableHeaderRow();
    table.appendChild(rollsTr);
    table.appendChild(headerTr);

    for (let betLabel in stat) {
        let tr = document.createElement('tr');

        let tdLabel = document.createElement('td');
        tdLabel.innerHTML = '<span>'+ betLabel +'</span>';

        let tdHi = stat[betLabel]['miss_hi_td'];
        let tdLo = stat[betLabel]['miss_lo_td'];

        tr.appendChild(tdLabel);
        tr.appendChild(tdHi);
        tr.appendChild(tdLo);

        table.appendChild(tr);
    }

    div.appendChild(table);
    document.documentElement.appendChild(div);

    function redraw() {
        numRollsTd.innerHTML = ''+numRolls+'';

        for (let betLabel in stat) {
            stat[betLabel]['miss_hi_td'].innerHTML = ''+stat[betLabel]['miss_hi']+'';
            stat[betLabel]['miss_lo_td'].innerHTML = ''+stat[betLabel]['miss_lo']+'';
        }

        // Chamada da função para decidir o próximo roll e exibir no console
        console.log('Próximo roll provavelmente será:', decideNextRoll());
    }

    let table_rows = document.getElementById('bet_history_table_rows');
    let rolls = [];

    let observer = new MutationObserver(function(mutationsList) {
        let roll;
        for (let mutation of mutationsList) {
            for (let addedNode of mutation.addedNodes) {
                if (addedNode.className == 'multiply_bet_history_table_row') {
                    roll = parseInt(addedNode.firstChild.childNodes[3].textContent);

                    if (isNaN(roll)) {
                        console.error('roll is Not a number');
                        continue;
                    }

                    if (roll >= 0 && roll <= 10000) {
                        numRolls++;

                        for (let betLabel in stat) {
                            if (betLabel == 8888) {
                                if (roll == 8888) {
                                    stat[betLabel]['miss_hi'] = 0;
                                    stat[betLabel]['miss_lo'] = 0;
                                } else {
                                    stat[betLabel]['miss_hi']++;
                                    stat[betLabel]['miss_lo']++;
                                }
                                continue;
                            }

                            if (roll > stat[betLabel]['hi']) {
                                stat[betLabel]['miss_hi'] = 0;
                            } else {
                                stat[betLabel]['miss_hi']++;
                            }

                            if (roll < stat[betLabel]['lo']) {
                                stat[betLabel]['miss_lo'] = 0;
                            } else {
                                stat[betLabel]['miss_lo']++;
                            }
                        }

                        // Redesenha a tabela e decide o próximo roll após cada roll observado
                        redraw();
                    } else {
                        console.error('roll is Not in valid range');
                    }
                }
            }
        }
    });

    let config = {
        childList: true,
    };

    observer.observe(table_rows, config);

    function tableRollsRow() {
        let fragment = document.createDocumentFragment();

        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let bold = document.createElement('strong');

        let rollsLabel = document.createTextNode('Rolls');

        bold.appendChild(rollsLabel);
        td.appendChild(bold);

        tr.appendChild(td);
        tr.appendChild(td.cloneNode());
        tr.appendChild(numRollsTd);

        fragment.appendChild(tr);
        return fragment;
    }

    function tableHeaderRow() {
        let fragment = document.createDocumentFragment();

        let tr = document.createElement('tr');

        let label1 = document.createTextNode('Odds');
        let label2 = document.createTextNode('HI');
        let label3 = document.createTextNode('LO');

        let bLabel1 = document.createElement('strong');
        bLabel1.appendChild(label1);

        let bLabel2 = document.createElement('strong');
        bLabel2.appendChild(label2);

        let bLabel3 = document.createElement('strong');
        bLabel3.appendChild(label3);

        let td1 = document.createElement('td');
        td1.appendChild(bLabel1);

        let td2 = document.createElement('td');
        td2.appendChild(bLabel2);

        let td3 = document.createElement('td');
        td3.appendChild(bLabel3);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        fragment.appendChild(tr);
        return fragment;
    }

    // Função para determinar se o próximo roll tem mais chance de ser HI ou LO
    function decideNextRoll() {
        // Exemplo simples: se o valor atual de miss_hi > miss_lo para uma certa odd, retorna 'HI', senão 'LO'
        let odd = 1.25; // A odd que você quer consultar
        if (stat[odd]['miss_hi'] > stat[odd]['miss_lo']) {
            return 'HI';
        } else {
            return 'LO';
        }
    }
})();

