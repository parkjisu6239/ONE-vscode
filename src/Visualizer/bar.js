import { renderSingleDetail, renderMultipleDetail } from './detail.js';

export default function renderBar(endTime, data){
    const barLists = document.querySelectorAll('.bar-list');
    const barList = barLists[barLists.length - 1];

    const bar = document.createElement('div');
    bar.className = "bar";
    bar.style.left = `${data.ts/endTime*100}%`;
    bar.style.width = `${data.dur/endTime*100}%`;
    bar.style.backgroundColor = `${data.backgroundColor}`;

    Object.keys(data).map(key => {
        if (key === 'args') {
            const args = data[key];
            const argList = Object.keys(args).map(key => {
                return `${key} : ${args[key]}`;
            });
            bar.dataset['args'] = argList.join('.#/#.');
        } else {
            bar.dataset[`${key}`] = data[key];       
        }
    });

    bar.addEventListener('click', e => {
        removeDetail();
        if (e.ctrlKey) {
            addSelectedBar(e.target.className === 'bar' ? e.target : e.target.parentNode);
            renderMultipleDetail();
        } else {
            removeSelectedBar();
            renderSingleDetail(e.target.className === 'bar' ? e.target.dataset : e.target.parentNode.dataset);
        }
    });
    
    const barTitle = document.createElement('div');
    barTitle.className = "bar-title";
    barTitle.innerText = data['name'];

    bar.append(barTitle);
    barList.append(bar);
}

function addSelectedBar(ele) {
    const selectedOpList = document.querySelectorAll('.selected-op');
    for (const selectedOp of selectedOpList) {
        if (selectedOp.dataset['pk'] === ele.dataset['pk']) {
            return;
        }
    }

    const selected = document.querySelector('.selected');
    const op = document.createElement('div');
    op.className = 'selected-op';
    Object.keys(ele.dataset).forEach(key => {
        op.dataset[key] = ele.dataset[key];
    });
    selected.append(op);
}

function removeSelectedBar() {
    const selected = document.querySelector('.selected');
    while(selected.hasChildNodes()) {
        selected.removeChild(selected.firstChild);
    }
}

function removeDetail() {
    const details = document.querySelectorAll('.detail');
    details.forEach(detail => {
        detail.remove();
    });
}