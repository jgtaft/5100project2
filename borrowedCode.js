//Code from: https://bl.ocks.org/mbostock/3887051
// function to show the normal scale graph 
function showNormal(){
	//setting the color to match the blue color in other graph
	var colors = d3.scaleOrdinal().range(["#A0CBF8", "#8DC0F7", "#79B6F6", "#66ABF4", "#53A1F3", "#4096F2"]);

	//collection data form csv file
	d3.csv("DataExpend.csv", function(d, i, columns) {
		//parsing out the data by column to help gather country and year data
	    for (var i = 1, n = columns.length; i < n; ++i) 
	    d[columns[i]] = +(d[columns[i]]);
	    return d;
	}, function(error, data) {
	    if (error) throw error;

	    //collecting all the years form the data set and making it an array 
	    var years = data.columns.slice(1);

	    //setting the x domain to the countries in the data set
	    x0.domain(data.map(function(d) { 
	      return d.CountryExpend; 
	    }));
	    // second x domain because showing five graphs per country 
	    x1.domain(years).rangeRound([0, x0.bandwidth()]);
	    // setting y domain based on the values for each year
	    y.domain([0, d3.max(data, function(d) { 
	      return d3.max(years, function(years) { 
	        return d[years]; 
	      }); 
	    })]).nice();

	    // appending to g
	    g.append("g")
	    	.selectAll("g")
	    	.data(data)
	    	.enter().append("g")
	      	//translating/transforming spot where each area for each country will be in the graph
	    		.attr("transform", function(d) { 
	          		return "translate(" + x0(d.CountryExpend) + ",0)"; 
	        	})
	      	.selectAll("rect")
	      	.data(function(d) { 
		      	//collecting the data and maping country, years and values for country to create rectangles
		        return years.map(function(years) { 
		         	return {years: years, value: d[years], country: d.CountryExpend}; 
		        	}); 
	        })
	      	// creating rectangles based on above with x value year and y value value of the specific year. Appending it so it all clusters together
	      	// for each country
	      	.enter().append("rect")
	        	.attr("x", function(d) { 
	          		return x1(d.years); 
	        	})
	        .attr("y", function(d) { 
	          	return y(d.value); 
	        })
	        .attr("fill", "white")
	        .attr("width", x1.bandwidth())
	        .attr("height", function(d) { 
	          	return height - y(d.value); 
	        })
	        .attr("fill", function(d) { 
	          	return colors(d.years); 
	        })
	        //code from: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
	        .on("mouseover", function(d) {		
	            div.transition()		
	                .duration(200)		
	                .style("opacity", .9);		
	            div	.html((d.country)+": "+(d.years)+"<br>"+"$"+(d.value))	
	                .style("left", (d3.event.pageX) + "px")		
	                .style("top", (d3.event.pageY - 28) + "px")
	                .style("position", "absolute")
	                .style("text-anchor", "middle")
	                .style("text-align", "center")
	                .style("width", 110 +"px")
	                .style("display", "block")
	                .style("padding-top", 3+"px")
	                .style("margin", "auto")
	                .style("height", 30+"px")
	                .style("color", "white")
	                .style("font-size", 10)
	                .style("background", "black")
	                .style("border", 0+"px")
	                .style("border-radius", 8+"px")
	                .style("pointer-events", "none");	
            })					
	        .on("mouseout", function(d) {		
	            div.transition()		
	                .duration(200)		
	                .style("opacity", 0);	
	        });

	    //creating x axis
	    g.append("g")
	        .attr("class", "axis")
	        .attr("fill", "white")
	        .attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(x0));

	    // creating y axis with hashes
	    g.append("g")
	        .attr("class", "axis")
	        .call(d3.axisLeft(y).ticks(null, "s"));

	    //creating x axis labels
	    svg.append("text") 
	    	.attr("class", "axisLabels")            
	      	.attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
	      	.style("text-anchor", "middle")
	      	.style("font-size", 10)
	      	.style("font-weight", "bold")
	      	.attr("fill", "white")
	      	.text("Country");
	      
		//creating y-axis labels
	    svg.append("text")
	    	.attr("class", "axisLabels")
	      	.attr("transform", "rotate(-90)")
	      	.attr("y", 0 - margin.right + 30)
	      	.attr("x",0 - (height / 2) -40)
	      	.attr("dy", "1em")
	      	.style("text-anchor", "middle")
	      	.style("font-size", 10)
	      	.style("font-weight", "bold")
	      	.attr("fill", "white")
	      	.text("Military Expenditure in $USD"); 

	    //creating title for graph
	    svg.append("text")
	    	.attr("class", "axisLabels")
		    .attr("text-anchor", "top")
		    .attr("text-align", "center")
		    .attr("font-weight", "bold")
		    .attr("fill", "white")
		    .attr("font-size", 20)
		    .attr("x", width/2-200)
		    .attr("y", 35)
		    .text("Millitary Expenditure Based on GDP in $USD (Standard Scale)");

	    // creating the legend for the graph with colors that match year
	    var legend = g.append("g")
	     	.attr("font-size", 10)
	     	.attr("text-anchor", "end")
	    .selectAll("g")
	    .data(years.slice().reverse())
	    .enter().append("g")
	    	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	      	//creating rectangles filled with color matching bar rectangles
		  	legend.append("rect")
		      	.attr("x", width - 19)
		    	.attr("width", 19)
		      	.attr("height", 19)
		      	.attr("fill", colors);

		  	//creating text for each rectangle in legend
		  	legend.append("text")
		      	.attr("x", width - 24)
		      	.attr("y", 9.5)
		      	.attr("dy", "0.32em")
		      	.attr("fill", "white")
		      	.text(function(d) { return d; });


	});
	//Help from: http://bl.ocks.org/juan-cb/ab9a30d0e2ace0d2dc8c
	// removing axis and rectangles so graph will update based on the button selected
	svg.selectAll("rect")
        .remove()
        .exit();
    svg.selectAll(".axis")
    	.remove()
    	.exit();
   	svg.selectAll(".axisLabels")
   		.remove()
   		.exit();

}
//code from: https://bl.ocks.org/mbostock/3887051
function showLog(){
	var colors = d3.scaleOrdinal().range(["#F6948D", "#F5827A", "#F47167", "#F25F54", "#F14D41", "#EF3B2E"]);
		//collection data form csv file
	d3.csv("DataExpend.csv", function(d, i, columns) {
		//parsing out the data by column to help gather country and year data
	    for (var i = 1, n = columns.length; i < n; ++i) 
	    d[columns[i]] = +Math.log(d[columns[i]]);
	    return d;
	}, function(error, data) {
	    if (error) throw error;

	    //collecting all the years form the data set and making it an array 
	    var years = data.columns.slice(1);

	    //setting the x domain to the countries in the data set
	    x0.domain(data.map(function(d) { 
	      	return d.CountryExpend; 
	    }));
	    // second x domain because showing five graphs per country 
	    x1.domain(years).rangeRound([0, x0.bandwidth()]);
	    // setting y domain based on the values for each year
	    y.domain([0, d3.max(data, function(d) { 
	      	return d3.max(years, function(years) { 
	        	return d[years]; 
	      	}); 
	    })]).nice();

	    // appending to g
	    g.append("g")
	      	.selectAll("g")
	      	.data(data)
	      	.enter().append("g")
	      		//translating/transforming spot where each area for each country will be in the graph
	        	.attr("transform", function(d) { 
	          		return "translate(" + x0(d.CountryExpend) + ",0)"; 
	        	})
	      	.selectAll("rect")
	      	.data(function(d) { 
	      		//collecting the data and maping years and values for country to create rectangles
	        	return years.map(function(years) { 
	          		return {years: years, value: d[years], country: d.CountryExpend}; 
	          	}); 
	        })
	      	// creating rectangles based on above with x value year and y value value of the specific year. Appending it so it all clusters together
	      	// for each country
	      	.enter().append("rect")
	        .attr("x", function(d) { 
	          	return x1(d.years); 
	        })
	        .attr("y", function(d) { 
	          	return y(d.value); 
	        })
	        .attr("width", x1.bandwidth())
	        .attr("height", function(d) { 
	          	return height - y(d.value); 
	        })
	        .attr("fill", function(d) { 
	          	return colors(d.years); 
	        })
	        //code from: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
	        .on("mouseover", function(d) {		
	            div.transition()		
	                .duration(200)		
	                .style("opacity", .9);		
	            div	.html((d.country)+": "+(d.years)+"<br>"+"$"+(Math.round(Math.exp(d.value))))	
	                .style("left", (d3.event.pageX) + "px")		
	                .style("top", (d3.event.pageY - 28) + "px")
	                .style("position", "absolute")
	                .style("text-anchor", "middle")
	                .style("text-align", "center")
	                .style("width", 110 +"px")
	                .style("display", "block")
	                .style("padding-top", 3+"px")
	                .style("margin", "auto")
	                .style("height", 30+"px")
	                .style("color", "white")
	                .style("font-size", 10)
	                .style("background", "black")
	                .style("border", 0+"px")
	                .style("border-radius", 8+"px")
	                .style("pointer-events", "none");	
            })					
	        .on("mouseout", function(d) {		
	            div.transition()		
	                .duration(200)		
	                .style("opacity", 0);	
	        });
	    //creating x axis
	    g.append("g")
	        .attr("class", "axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(x0));

	    // creating y axis with hashes
	    g.append("g")
	        .attr("class", "axis")
	        .call(d3.axisLeft(y).ticks(null, "s"));

	    //creating x axis labels
	    svg.append("text") 
	    	.attr("class", "axisLabels")            
	      	.attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
	      	.style("text-anchor", "middle")
	      	.style("font-size", 10)
	      	.style("font-weight", "bold")
	      	.attr("fill", "white")
	      	.text("Country");
	      
		//creating y-axis labels
	    svg.append("text")
	    	.attr("class", "axisLabels")
	      	.attr("transform", "rotate(-90)")
	      	.attr("y", 0 - margin.right + 30)
	      	.attr("x",0 - (height / 2) -40)
	      	.attr("dy", "1em")
	      	.style("text-anchor", "middle")
	      	.style("font-size", 10)
	      	.style("font-weight", "bold")
	      	.attr("fill", "white")
	      	.text("Military Expenditure in $USD"); 

	    //creating title for graph
	    svg.append("text")
	    	.attr("class", "axisLabels")
		    .attr("text-anchor", "top")
		    .attr("text-align", "center")
		    .attr("font-weight", "bold")
		    .attr("fill", "white")
		    .attr("font-size", 20)
		    .attr("x", width/2-200)
		    .attr("y", 35)
		    .text("Millitary Expenditure Based on GDP in $USD (Log Scale)");

	    // creating the legend for the graph with colors that match year
	    var legend = g.append("g")
	      	.attr("font-size", 10)
	      	.attr("text-anchor", "end")
	    .selectAll("g")
	    .data(years.slice().reverse())
	    .enter().append("g")
	      	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	      	//creating rectangles filled with color matching bar rectangles
		  	legend.append("rect")
		      	.attr("x", width - 19)
		      	.attr("width", 19)
		      	.attr("height", 19)
		      	.attr("fill", colors);

		  	//creating text for each rectangle in legend
		  	legend.append("text")
		      	.attr("x", width - 24)
		      	.attr("y", 9.5)
		      	.attr("dy", "0.32em")
		      	.text(function(d) { return d; });
	});
	//Help from: http://bl.ocks.org/juan-cb/ab9a30d0e2ace0d2dc8c
	// removing axis and rectangles so graph will update based on the button selected
	svg.selectAll("rect")
        .remove()
        .exit();
    svg.selectAll(".axis")
    	.remove()
    	.exit();
   	svg.selectAll(".axisLabels")
   	 	.remove()
   	 	.exit();
}
