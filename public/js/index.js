$(document).ready(function () {

   function deleteMovie() {
       var id = $(this).val();
       $.ajax({
           method: "DELETE",
           url: "api/movies/" + id,
       })
           .then(getList);
   };
   function postMovie() {
       displayMovieAdded();
       var movie = {
           movie_name: $(".title-h1").text(),
           movie_poster: $(".movie-poster").attr("src"),
           api_id: $(".title-h1").attr("data-movieId")
       };
       $.ajax({
           type: "POST",
           url: "/api/movies/",
           data: movie,
           dataType: "json",
       });
   };

   function createList(movieData) {
       var databaseId = movieData.id;
       var movieId = movieData.api_id;
       var movieTitle = movieData.movie_name;
       var moviePoster = movieData.movie_poster;
       var button = $('<a>');
       var cardDiv = $('<div>');
       cardDiv.addClass('card');
       var cardImage = $('<div>');
       cardImage.addClass('card-image');
       var imgFigure = $('<figure>');
       imgFigure.addClass('image');
       var image = $('<img>');
       image.attr('src', moviePoster);
       image.attr('data-movieId', movieId);
       image.attr('data-databaseId', databaseId);
       image.addClass('movie-image');
       imgFigure.append(image);
       cardImage.append(imgFigure);
       cardDiv.append(cardImage);
       var cardContent = $('<div>');
       cardContent.addClass('card-content has-text-centered');
       var content = $('<div>');
       content.addClass('content');
       var button = $('<a>');
       button.addClass('delete is-warning is-rounded remove-movie');
       button.text('X');
       button.val(databaseId);
       imgFigure.append(button);
       $('.movies-container').append(cardDiv);
   }

   // function getList() {
   //     $.get("api/movies", function (data) {
   //         $('.movies-container').empty();
   //         $(".movies-container-title").text("My Movie List:");
   //         for (var i = 0; i < data.length; i++) {
   //             createList(data[i]);
   //         }
   //     })
   // };

   function getMovie() {
       displayModal();
       var movieId = $(this).attr("data-movieId");
       var imdbId = "";
       var moviePlot = "";
       var moviePoster = "";
       var youtubeKey = "";
       var queryURL = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=334b49082e33d253104308d330ccdd13&language=en-US";
       $.ajax({
           url: queryURL,
           method: "GET"
       }).then(function (result) {
           youtubeKey = result.results[0].key;
       }).then(function () {
           queryURL = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=334b49082e33d253104308d330ccdd13&language=en-US";
           $.ajax({
               url: queryURL,
               method: "GET"
           }).then(function (response) {
               imdbId = response.imdb_id;
               moviePlot = response.overview;
               moviePoster = "https://image.tmdb.org/t/p/original/" + response.poster_path;
           }).then(function () {
               queryURL = "http://www.omdbapi.com/?apikey=trilogy&i=" + imdbId;
               $.ajax({
                   url: queryURL,
                   method: "GET"
               }).then(function (res) {
                   var movie = {
                       title: res.Title,
                       poster: moviePoster,
                       plot: moviePlot,
                       year: res.Year,
                       cast: res.Actors,
                       director: res.Director,
                       genre: res.Genre,
                       rated: res.Rated,
                       runtime: res.Runtime,
                       imdbRating: res.imdbRating,
                       tmdbId: movieId,
                       imdbId: imdbId,
                       trailer: youtubeKey
                   }
                   $(".title-h1").text(movie.title + " (" + movie.year + ")");
                   $(".title-h1").attr("data-movieId", movieId);
                   $(".movie-poster").attr("src", moviePoster);
                   $(".director").text("Director: " + movie.director);
                   $(".actors").text("Actors: " + movie.cast);
                   $(".plot").text(movie.plot);
                   $(".rating").text("IMDB Rating: " + movie.imdbRating);
                   $(".trailer").attr("src", "https://www.youtube.com/embed/" + youtubeKey);
               });
           });
       });
   };

   function searchMovie(){
       var movieName = $('#user-input').val().trim();
       movieName = movieName.replace(" ", "%20");
       if (movieName === "") {
           displayWarning();
       }
       else {
           $('#user-input').val("");
           $('.movies-container').empty();
           var movieId = 0;
           var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=334b49082e33d253104308d330ccdd13&language=en-US&query=" + movieName + "&page=1&include_adult=false"
           $.ajax({
               url: queryURL,
               method: "GET"
           }).then(function(response){
               $(".movies-container-title").text(movieName.replace("%20", " ") + ":");
               for (var i = 0; i < 20; i++){
                   var movieId = response.results[i].id;
                   var movieTitle = response.results[i].original_title;
                   var moviePoster = "https://image.tmdb.org/t/p/original/" + response.results[i].poster_path;
                   var trendingMovie = {
                       movieTitle: movieTitle,
                       movieId : movieId,
                       moviePoster: moviePoster
                   };
                   var cardDiv = $('<div>');
                   cardDiv.addClass('card');
                   var cardImage = $('<div>');
                   cardImage.addClass('card-image');
                   var imgFigure = $('<figure>');
                   imgFigure.addClass('image');
                   var image = $('<img>');
                   image.attr('src', moviePoster);
                   image.attr('data-movieId', movieId);
                   image.addClass('movie-image');
                   imgFigure.append(image);
                   cardImage.append(imgFigure);
                   cardDiv.append(cardImage);
                   $('.movies-container').append(cardDiv);  
               };    
           });
       };
   };

   function searchActor() {
       var actorName = $('#user-input').val().trim();
       actorName = actorName.replace(" ", "%20");
       if (actorName === "") {
           displayWarning();
       }
       else {
           $('#user-input').val("");
           // jQuery get actor from input, trim ending spaces and replace middle spaces with "%20"
           var actorId = 0;
           var queryURL = "https://api.themoviedb.org/3/search/person?api_key=334b49082e33d253104308d330ccdd13&language=en-US&query=" + actorName + "&page=1&include_adult=false";
           $.ajax({
               url: queryURL,
               method: "GET"
           }).then(function (response) {
               actorId = response.results[0].id;
               var actor = {
                   name: response.results[0].name,
                   actorId: actorId
               };
               $(".movies-container-title").text(actor.name + ":");
           }).then(function () {
               $(".movies-container").empty();
               queryURL = "https://api.themoviedb.org/3/person/" + actorId + "/movie_credits?api_key=334b49082e33d253104308d330ccdd13&language=en-US";
               $.ajax({
                   url: queryURL,
                   method: "GET"
               }).then(function (response) {
                   for (var i = 0; i < 30; i++) {
                       var movieTitle = response.cast[i].title;
                       var movieId = response.cast[i].id;
                       var moviePoster = "https://image.tmdb.org/t/p/original/" + response.cast[i].poster_path;
                       var movie = {
                           movieTitle: movieTitle,
                           movieId: movieId,
                           moviePoster: moviePoster,
                           movie: movie
                       }
                       var cardDiv = $('<div>');
                       cardDiv.addClass('card');
                       var cardImage = $('<div>');
                       cardImage.addClass('card-image');
                       var imgFigure = $('<figure>');
                       imgFigure.addClass('image');
                       var image = $('<img>');
                       image.attr('src', moviePoster);
                       image.attr('data-movieId', movieId);
                       image.addClass('movie-image');
                       imgFigure.append(image);
                       cardImage.append(imgFigure);
                       cardDiv.append(cardImage);
                       $('.movies-container').append(cardDiv);
                   };
               });
           });
       };
   };

   function getTrending() {
       var queryURL = "https://api.themoviedb.org/3/trending/movie/day?api_key=334b49082e33d253104308d330ccdd13";
       $.ajax({
           url: queryURL,
           method: "GET"
       }).then(function (response) {
           $(".movies-container").empty();
           $(".movies-container-title").text("Trending: ");
           for (var i = 0; i < 20; i++) {
               var movieId = response.results[i].id;
               var movieTitle = response.results[i].original_title;
               var moviePoster = "https://image.tmdb.org/t/p/original/" + response.results[i].poster_path;
               var trendingMovie = {
                   movieTitle: movieTitle,
                   movieId: movieId,
                   moviePoster: moviePoster,
                   trendingMovie: trendingMovie
               };
               var cardDiv = $('<div>');
               cardDiv.addClass('card');
               var cardImage = $('<div>');
               cardImage.addClass('card-image');
               var imgFigure = $('<figure>');
               imgFigure.addClass('image');
               var image = $('<img>');
               image.attr('src', moviePoster);
               image.attr('data-movieId', movieId);
               image.addClass('movie-image');
               imgFigure.append(image);
               cardImage.append(imgFigure);
               cardDiv.append(cardImage);
               $('.movies-container').append(cardDiv);
           };
       });
   };

   // Get all "navbar-burger" elements
   const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

   // Check if there are any navbar burgers
   if ($navbarBurgers.length > 0) {

       // Add a click event on each of them
       $navbarBurgers.forEach(el => {
           el.addEventListener('click', () => {

               // Get the target from the "data-target" attribute
               const target = el.dataset.target;
               const $target = document.getElementById(target);

               // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
               el.classList.toggle('is-active');
               $target.classList.toggle('is-active');
               el.classList.toggle('add-black');
               $target.classList.toggle('add-black');
           });
       });
   };

   function hideKeyboard() {
       document.activeElement.blur();
       $(".input").blur();
   };

   function displayModal() {
       $("#movie-modal").toggleClass("is-active");
       $("html").toggleClass("is-clipped");
   };

   function displayMovieAdded() {
       $("#added-modal").toggleClass("is-active");
       $("html").toggleClass("is-clipped");
   }

   getTrending();
   // displayWatchList();
   $(document).on('click', '#home', getTrending);
   $(document).on('click', '.remove-movie', deleteMovie);
   $(document).on('click', '.added-close', displayMovieAdded);
   // $(document).on('click', '#my-list', getList);
   $(document).on('click', '#watch-submit', postMovie);
   $(document).on('click', '.movie-image', getMovie);
   $(document).on('click', '.modal-close', displayModal);
   $(document).on('click', '#actor-submit', searchActor);
   $(document).on('click', '#movie-submit', searchMovie);
   $(document).keyup(function (event) {
       if (event.keyCode === 13) {
           event.preventDefault();
           getStats();
           hideKeyboard();
       }
       return false;
   });

});