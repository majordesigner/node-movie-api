# node-movie-api
Node JS, Express ve MongoDb kullanılarak yapılan film tabanlı bir restful API projesi.

# Movies
| Route | Http Verb | Post Body | Description |
| --- | --- | --- | --- |
| /api/movies/ | `GET` | Empty | List all movies. |
| /api/movies/ | `POST` | {'title': 'foo', 'category': 'bar', 'country': 'USA', 'director': 'id', 'imdb_score': 9, 'year': 1984 } | Add a new movie. |