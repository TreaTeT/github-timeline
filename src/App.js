import React from "react";
import "./App.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { useForm } from "react-hook-form";
import "react-vertical-timeline-component/style.min.css";

function App() {
  const axios = require("axios");
  const { register, handleSubmit } = useForm();
  const [user, setUser] = React.useState();
  const [repos, setRepos] = React.useState();

  const onSubmit = ({ name }) => {
    axios
      .all([
        axios.get(`https://api.github.com/users/${name}`, {}),
        axios.get(`https://api.github.com/users/${name}/repos`, {}),
      ])
      .then(
        axios.spread((user, repos) => {
          setUser(user.data);

          setRepos(repos.data.sort((a, b) => a.created_at < b.created_at));
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col sm:py-12">
      <p className="mx-auto font-bold text-4xl mb-5 tracking-wide text-blue-500">
        Github Timeline
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
        <input
          type="text"
          name="name"
          ref={register({ required: true })}
          placeholder="Please enter you Github login"
          className="block mx-auto outline-none w-80 py-1 border-green-500 border-t-2 rounded  px-2 font-normal mb-5"
        />
        <input
          type="submit"
          value="Submit"
          className="block mx-auto p-1.5 m-2 bg-green-500 text-white outline-none font-bold text-opacity-80 border-b-2 border-green-600 shadow-md cursor-pointer rounded hover:bg-green-400 hover:text-opacity-100"
        />
      </form>

      {user ? (
        <div className="flex bg-white shadow-lg w-96 mx-auto rounded-lg h-48 items-center mt-10">
          <img
            src={user.avatar_url}
            className="rounded-full w-28 h-28 ml-10 ring-4 ring-green-500"
            alt="github user"
          ></img>
          <div className="mx-auto font-semibold">
            <ul>
              <li className="text-blue-600 outline-none">
                <a target="_blank" href={user.html_url} rel="noreferrer">
                  {user.login}
                </a>
              </li>
              <li>{`${user.followers} followers`}</li>
              <li>{`${user.public_repos} public repos`}</li>
              <li>{`joined ${user.created_at
                .split("")
                .splice(0, 10)
                .join("")}`}</li>
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}

      {repos ? (
        <VerticalTimeline animate={false}>
          {repos.map((repo) => {
            return (
              <VerticalTimelineElement
                iconStyle={{
                  background: "rgb(33, 150, 243)",
                  color: "#fff",
                  display: "none",
                }}
              >
                <h3 className="font-bold text-lg text-gray-700">{repo.name}</h3>
                <ul>
                  <li className="text-md text-blue-400 font-semibold">
                    <a target="_blank" href={repo.html_url} rel="noreferrer">
                      {repo.html_url}
                    </a>
                  </li>
                  <li className="text-md text-gray-900 text-2sm leading-relaxed">{`created ${repo.created_at
                    .split("")
                    .splice(0, 10)
                    .join("")}`}</li>
                  <li className="text-md text-gray-900 text-2sm leading-relaxed">
                    {`last updated ${repo.pushed_at
                      .split("")
                      .splice(0, 10)
                      .join("")}`}
                  </li>
                  <li className="text-md text-green-500 text-lg font-bold leading-relaxed">
                    {repo.language ? repo.language.toUpperCase() : ""}
                  </li>

                  {repo.fork ? (
                    <li className="text-gray-70 text-sm leading-relaxed">
                      forked
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;