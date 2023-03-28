d3.csv("./Scatter.csv").then(function (data) {
  const datum = data.map((d) => {
    return {
      gdp: Number(d.GDP),
      expectancy: Number(d["Life expectancy"]),
      country: d.Entity,
    };
  });

  const container = { container: ".container" };
  chart(datum, container);

  window.addEventListener("resize", function () {
    const div = document.querySelector(".container");
    div.innerHTML = "";
    chart(datum, container);
  });

  
  
});
