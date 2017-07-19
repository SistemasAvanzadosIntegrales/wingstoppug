var contador = 1;
var contador2 = 1;
 
$(document).ready(function(){
  

	$('.mn').click(function(e){
        e.stopPropagation();
		if (contador == 1) {
			$('nav').animate({
				left: '0'
			});
			contador = 0;
		} else {
			contador = 1;
			$('nav').animate({
				left: '-100%'
			});
		}
	});
    
    $('.mn2').click(function(e){
        e.stopPropagation();
		if (contador2 == 1) {
			$('aside').animate({
				right: '0'
			});
			contador2 = 0;
		} else {
			contador2 = 1;
			$('aside').animate({
				right: '-100%'
			});
		}
	});
});
 



function afuera() {
    //alert("Entro");
	if(contador == 0){
        $('nav').animate({
				left: '-100%'
		});

    }
    if(contador2 == 0){
        $('aside').animate({
            right: '-100%'
        });
    }
}
