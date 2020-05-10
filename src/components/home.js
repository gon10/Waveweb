import React from "react";
import Movie from "./movie";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: undefined };
  }

  componentDidMount() {
    fetch(
      "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7d96aabc2cc7be22f66ba8ac23884894"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.results);
        this.setState({ data });
      });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div
        className="flex-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "0 4px",
        }}
      >
        {this.state.data &&
          this.state.data.results &&
          this.state.data.results.map((movie) => {
            return <Movie key={movie.id} movie={movie}></Movie>;
          })}
      </div>
    );
  }
}
