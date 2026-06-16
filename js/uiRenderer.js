const UIRenderer = (() => {

function clear() {  
    document.querySelectorAll('.ui-panel').forEach(el => el.remove());  
}  

function render(screenId) {  
    clear();  

    switch(screenId) {  
        case 'e02_meteo':  
            renderMeteo(screenId);  
            break;  
        case 'e08_constellation':  
            renderConstellation(screenId);  
            break;  
        case 'e09_voyage':  
            renderVoyage(screenId);  
            break;  
    }  
}  

function renderMeteo(screenId) {  
    const screen = document.getElementById(screenId);  
    if (!screen) return;  

    const panel = document.createElement('div');  
    panel.className = 'ui-panel meteo-panel';  

    ['☀ Éclaircie','🌤 Transition','❓ Je ne sais pas','🌫 Brouillard','⛈ Tempête']  
    .forEach(label => {  
        const btn = document.createElement('button');  
        btn.className = 'ui-button';  
        btn.textContent = label;  
        btn.addEventListener('click', () => {  
            if (typeof Navigation !== 'undefined') {  
                Navigation.goTo('e03_boussole');  
            }  
        });  
        panel.appendChild(btn);  
    });  

    screen.appendChild(panel);  
}  

function renderConstellation(screenId) {}  
function renderVoyage(screenId) {}  

console.log('UIRenderer chargé');  

return { render, clear };

})();
