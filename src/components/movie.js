import React from "react";

export default class Movie extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch(
      "https://image.tmdb.org/t/p/w500/" + this.props.movie.poster_path + "'",
      { mode: "no-cors" }
    ).then((response) => {
      console.log(response);
    });
    //   .then((movieImg) => {
    //     this.setState({ movieImg });
    //   });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div
        className="movie"
        style={{
          backgroundColor: "#e2e2e2",
          flex: "20%",
          maxWidth: "20%",
          padding: "0 4px",
          margin: "2%",
          position: "relative",
          borderRadius: "5px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <b>Title: </b>
          <span style={{ color: "#333", fontSize: "1rem" }}>
            {this.props.movie.title}
          </span>
        </div>
        <div style={{ marginBottom: "45px" }}>
          Overview:{" "}
          <span style={{ color: "#666", fontSize: "0.8rem" }}>
            {this.props.movie.overview}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: "0" }}>
          Popularity:{" "}
          <span style={{ color: "#333", fontSize: "1rem" }}>
            {this.props.movie.popularity}
          </span>
        </div>
      </div>
    );
  }
}
