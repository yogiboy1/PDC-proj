
const {ipcRenderer}=require('electron');

$(function () {
    $('select').material_select();
    let fileEvent;
    let imageLoader = document.querySelector('#imageLoader');
    imageLoader.addEventListener('change',e=>fileEvent=e, false);
    function startSimulation(){
        let reader = new FileReader();
        reader.onload = function(event){
            let data={
                image:event.target.result,
                sims:$('#sims').val(),
                type:$('.select-dropdown').val()
            };
            console.log(data);
            ipcRenderer.send('data:load',data);
        };
        reader.readAsDataURL(fileEvent.target.files[0]);
    }
    $('#start').click(function () {
           startSimulation();
    });
});