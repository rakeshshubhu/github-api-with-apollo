import React from "react";
// import axios from "axios";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

interface IViewer {
  name: string;
  avatarUrl: string;
}

interface IQueryResult {
  viewer: IViewer;
}

const GET_VIEWER = gql`
  {
    viewer {
      name
      avatarUrl
    }
  }
`;

const Header: React.FC = () => {
  const { loading, data, error } = useQuery<IQueryResult, {}>(GET_VIEWER);

  if(loading){
    return <div className="viewer">loading ...</div>;  
  }

  if(error){
    return <div className="viewer">{error.toString}</div>
  }

  return (
      <div>
        {
            data ? 
            (
              <div>
                <img src={data.viewer.avatarUrl} className="avatar" />
                <div className="viewer">{data.viewer.name || "No name"}</div>
                <h1>GitHub Search</h1>
              </div>
            ) : ''
        }
      </div>
  );
};
export default Header;
