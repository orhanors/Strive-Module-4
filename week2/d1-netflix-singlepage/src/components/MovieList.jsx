import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SingleMovie from "./SingleMovie";
import ModalForm from "./ModalForm";
import { Spinner } from "react-bootstrap";
class MovieList extends React.Component {
	state = {
		Movies: [],
		selectedMovie: null,
		displayModal: false,
		loading: false,
	};

	sortAsc = (array) => {
		array.sort(function (a, b) {
			var movieA = a.Year; // ignore upper and lowercase
			var movieB = b.Year; // ignore upper and lowercase
			if (movieA > movieB) {
				return -1;
			}
			if (movieA < movieB) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	};

	getMovies = async () => {
		this.setState({ loading: true });
		try {
			let response = await fetch(
				"http://www.omdbapi.com/?apikey=827e9820&s=" + this.props.query
			);
			let movies = await response.json();

			if (response.ok) {
				let newMovies = movies.Search;
				this.sortAsc(newMovies);

				this.setState({ loading: false });
				this.setState({ Movies: newMovies.slice(0, 6) });
			}
		} catch (e) {
			console.log("error: ", e);
			this.setState({ loading: false });
		}
	};

	componentDidMount = () => {
		this.getMovies();
	};

	componentDidUpdate(prevProps, prevUpdates) {
		if (prevProps.query !== this.props.query) {
			this.getMovies();
		}
	}

	render() {
		return (
			<>
				<Container>
					{this.state.selectedMovie && (
						<ModalForm
							show={this.state.displayModal}
							movie={this.state.selectedMovie}
							onHide={() =>
								this.setState({ displayModal: false })
							}
						/>
					)}

					<h1 className='mt-4 mb-5'>
						{this.props.query.toUpperCase()}
					</h1>
					<Row>
						{this.state.loading ? (
							<Spinner
								style={{ marginLeft: "50%" }}
								animation='grow'
								variant='danger'
							/>
						) : (
							this.state.Movies.map((movie) => (
								<Col
									xs={6}
									md={3}
									lg={2}
									key={`MovieID${movie.imdbID}`}
									className='mb-3'>
									<SingleMovie
										Movie={movie}
										onClicked={() =>
											this.setState({
												displayModal: true,
												selectedMovie: movie,
											})
										}
									/>
								</Col>
							))
						)}
					</Row>

					{/* <h1 className="mt-4 mb-3">SUPERMAN</h1>
          <Row>
            {this.state.Movies.superman.map((movie) => (
              <Col
                xs={6}
                md={3}
                lg={2}
                key={`MovieID${movie.imdbID}`}
                className="mb-3"
              >
                <SingleMovie
                  Movie={movie}
                  onClicked={() =>
                    this.setState({
                      displayModal: true,
                      selectedMovie: movie,
                    })
                  }
                />
              </Col>
            ))}
          </Row>

          <h1 className="mt-4 mb-3">HULK</h1>
          <Row>
            {this.state.Movies.hulk.map((movie) => (
              <Col
                xs={6}
                md={3}
                lg={2}
                key={`MovieID${movie.imdbID}`}
                className="mb-3"
              >
                <SingleMovie
                  Movie={movie}
                  onClicked={() =>
                    this.setState({
                      displayModal: true,
                      selectedMovie: movie,
                    })
                  }
                />
              </Col>
            ))}
          </Row> */}
				</Container>
			</>
		);
	}
}

export default MovieList;
