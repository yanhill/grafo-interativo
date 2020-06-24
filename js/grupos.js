var clusters = [];

//CONFIGURAÇÃO DO SIGMA AO INICIAR
function configSigmaElements(config) {
	$GP=config.GP;
    
    // Node hover behaviour
    if (config.features.hoverBehavior == "dim") {

		var greyColor = '#aaa';

		sigInst.bind('overnodes',function(event){
		var nodes = event.content;
		var neighbors = {};

		sigInst.iterEdges(function(e){
		if(nodes.indexOf(e.source)<0 && nodes.indexOf(e.target)<0){
			if(!e.attr['grey']){
				e.attr['true_color'] = e.color;
				e.color = greyColor;
				e.attr['grey'] = 1;
			}
		}else{
			e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
			e.attr['grey'] = 0;

			neighbors[e.source] = 1;
			neighbors[e.target] = 1;
		}
		}).iterNodes(function(n){
			if(!neighbors[n.id]){
				if(!n.attr['grey']){
					n.attr['true_color'] = n.color;
					n.color = greyColor;
					n.attr['grey'] = 1;
				}
			}else{
				n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
				n.attr['grey'] = 0;
			}

		}).draw(2,2,2);
		}).bind('outnodes',function(){
		sigInst.iterEdges(function(e){
			e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
			e.attr['grey'] = 0;
		}).iterNodes(function(n){
			n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
			n.attr['grey'] = 0;
		}).draw(2,2,2);
		});

    } else if (config.features.hoverBehavior == "hide") {

		sigInst.bind('overnodes',function(event){
			var nodes = event.content;
			var neighbors = {};
		sigInst.iterEdges(function(e){
			if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
		    	neighbors[e.source] = 1;
		    	neighbors[e.target] = 1;
		  	}
		}).iterNodes(function(n){
		  	if(!neighbors[n.id]){
		    	n.hidden = 1;
		  	}else{
		    	n.hidden = 0;
		  }
		}).draw(2,2,2);
		}).bind('outnodes',function(){
		sigInst.iterEdges(function(e){
		  	e.hidden = 0;
		}).iterNodes(function(n){
		  	n.hidden = 0;
		}).draw(2,2,2);
		});

    }
    $GP.bg = $(sigInst._core.domElements.bg);
    $GP.bg2 = $(sigInst._core.domElements.bg2);
    
    var a = [],
        b,x=1;
		for (b in sigInst.clusters) a.push('<div style="line-height:12px"><a href="#' + b + '"><div style="width:40px;height:12px;border:1px solid #fff;background:' + b + ';display:inline-block"></div> Group ' + (x++) + ' (' + sigInst.clusters[b].length + ' members)</a></div>');
    //a.sort();
  //  $GP.cluster.content(a.join(""));
    b = {
        minWidth: 400,
        maxWidth: 800,
        maxHeight: 600
    };//        minHeight: 300,
    $("a.fb").fancybox(b);
    $("#zoom").find("div.z").each(function () {
        var a = $(this),
            b = a.attr("rel");
        a.click(function () {
			if (b == "center") {
				sigInst.position(0,0,1).draw();
			} else {
		        var a = sigInst._core;
	            sigInst.zoomTo(a.domElements.nodes.width / 2, a.domElements.nodes.height / 2, a.mousecaptor.ratio * ("in" == b ? 1.5 : 0.5));		
			}

        })
    });
    $GP.mini.click(function () {
        $GP.mini.hide();
        $GP.intro.show();
        $GP.minifier.show()
	});
	
    $GP.minifier.click(function () {
        $GP.intro.hide();
        $GP.minifier.hide();
        $GP.mini.show()
	});
	
    $GP.intro.find("#showGroups").click(function () {
        !0 == $GP.showgroup ? showGroups(!1) : showGroups(!0)
	});
	
    a = window.location.hash.substr(1);
    if (0 < a.length) switch (a) {
    case "Groups":
        showGroups(!0);
        break;
    case "information":
        $.fancybox.open($("#information"), b);
        break;
    default:
        $GP.search.exactMatch = !0, $GP.search.search(a)
		$GP.search.clean();
    }

	renomearValores();
	createCluster();
	drawBars();   	
	drawPercentageBar();
	listActorsBy("Grau de entrada");
	colorBars();
	selectCluster();
	trabalharZoom();
	//colorizeActors("Grau de entrada");
}

function renomearValores(){
	$GP.selection_atores_sum.html(sigInst.getNodesCount());
	$GP.selection_retweets_sum.html(sigInst.getEdgesCount());
}

function createCluster(){
	clusters = Object.values(sigInst.clusters);
    clusters.sort(function(a, b){
        return b.length - a.length;
    });
}

function drawBars(){
	var membersLimit = 1500;
	var firstMember = 0;

    for(let position = 0; position < clusters.length ; position++){
		clusterColor = sigInst.getNodes(clusters[position][firstMember]).color;

		var numberOfMembers = clusters[position].length;
		var barLength = (numberOfMembers * 100) / membersLimit;

		$GP.grupos_gpContainer.append("<div class=" + 'grupo'+position  + " href='" + clusterColor + "'" + ">" +
											"<div class='cima-grupos'>" +
												"<div class='position'> Grupo " + position + "</div>"+ 
												"<div class='qnt-de-membros'>" + numberOfMembers + " </div>" +
											"</div>"+
											"<div class='baixo1'>" +
												"<div class='engodo1'></div>" +
												"<div class='engodo2'></div>" +
												"<div class='barra barra"+ position +"'>" +
											"</div>" +
									"</div>");					

		$('.barra' + position).css('width', barLength/6 + "%");
	}	
	$('.container-do-grafico > div').addClass('grupo'); 
} 

    function colorBars(){
		var clusterColor;
		const firstMember = 0;

		for(let position = 0 ; position < clusters.length; position++){
            clusterColor = sigInst.getNodes(clusters[position][firstMember]).color;

			$GP.grupos.find('.barra'+ position).css('border-bottom', '3px solid ' + clusterColor);
			$GP.porcentagem.find('.barra'+ position).css('border-bottom', '3px solid ' + clusterColor);
		}
	}
	
	function drawPercentageBar(){
		var allNodes = sigInst.getNodesCount();
		var numberOfMembers;
		var barLength;

		for(let position = 0 ; position < clusters.length; position++){
			numberOfMembers = clusters[position].length;
			barLength = (numberOfMembers * 100) / allNodes;

			$GP.porcentagem_gpContainer.append("<div class=barra"+position  + ' style=width:'+barLength + '%;' + 'height:10px;' + 'float:left;' +  ">" + Math.round(barLength) +"%" + "</div>");										
		}
	}

	function listActorsBy(propertie){
		var nodeColor;
		var nodesIndexList = Object.values(sigInst._core.graph.nodesIndex);
		var sortedNodes;
		var actorsShown = 30;
		
		sortedNodes = nodesIndexList.sort(function(a, b){
			return b.attr.attributes[propertie] - a.attr.attributes[propertie];
		});

		for(let position = 0; position < actorsShown ; position++){

			$GP.actors_container.append("<div class='grupo-atores actor"+position+ "'>" +
											"<div class='cima'>" +
												"<div class= position>" + (position + 1) + "</div>"+ 
												"<div class='cluster-localizado' style=background:"+  sortedNodes[position].color+" ></div>"+ 
												"<div class='name' >" + sortedNodes[position].label + "</div>" +
												"<div class=" + 'qnt-de-membros>' + sortedNodes[position].attr.attributes[propertie] + " </div>" +
											"</div>" +
											"<div class='baixo'>" +
												"<div class='engodo1'></div>" +
												"<div class='engodo2'></div>" +
												"<div class='barra barra"+ position +"'>" +
											"</div>" +
										"</div>");


			var barLength = (sortedNodes[position].attr.attributes[propertie] * 100) / 2500;

			$GP.actors_container.find('.barra' + position).css('width', barLength + "%");
			$GP.actors_container.find('.barra' + position).css('border-bottom', '3px solid #fff');

			console.log(nodeColor);
		}

		$GP.actors_container.children().addClass('actor'); 
	}

	function selectCluster(){
		this.$GP.grupos.find(".grupo").click(function (){
			var colorCluster = $(this).attr("href");
			showCluster(colorCluster);
		});	
	}

	function trabalharZoom(){	
		
		/*
		sigInst.iterEdges(function(edge) {
			edge.color = 'RGBA(255,255,255,0.3';
		});
		*/

		//sigInst.zoomTo(a.domElements.nodes.width / 2, a.domElements.nodes.height / 2, a.mousecaptor.ratio * ("in" == b ? 1.5 : 0.5));
		sigInst.position(450,225,0.5).draw();	
	}
