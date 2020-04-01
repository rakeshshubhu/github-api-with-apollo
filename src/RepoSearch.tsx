import React from "react";
import gql from "graphql-tag";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";

interface ISearch {
  orgName: string;
  repoName: string;
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface IRepo {
  id: string;
  name: string;
  description: string;
  viewerHasStarred: boolean;
  stargazers: {
    totalCount: number;
  };
  issues: {
    edges: [
      {
        node: {
          id: string;
          title: string;
          url: string;
        };
      }
    ];
  };
}

interface IRepository {
  repository: IRepo;
}

const defaultRepo: IRepo = {
  id: "",
  name: "",
  description: "",
  viewerHasStarred: false,
  stargazers: {
    totalCount: 0
  },
  issues: {
    edges: [
      {
        node: {
          id: "",
          title: "",
          url: ""
        }
      }
    ]
  }
};

interface IRepoVariables {
  orgName: string;
  repoName: string;
}

const SEARCH_REPO = gql`
  query GetRepo($orgName: String!, $repoName: String!) {
    repository(owner: $orgName, name: $repoName) {
      id
      name
      description
      viewerHasStarred
      stargazers {
        totalCount
      }
      issues(last: 5) {
        edges {
          node {
            id
            title
            url
            publishedAt
          }
        }
      }
    }
  }
`;

const STAR_REPO = gql`
  mutation($repoId: ID!) {
    addStar(input: { starrableId: $repoId }) {
      id
      starrable {
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const RepoSearch = () => {
  const [search, setSearch] = React.useState<ISearch>({
    orgName: "",
    repoName: ""
  });

  const [repo, setRepo] = React.useState<IRepo>(defaultRepo);

  const [searchQuery, { loading, data, error }] = useLazyQuery<
    IRepository,
    IRepoVariables
  >(SEARCH_REPO, {
    variables: { orgName: search.orgName, repoName: search.repoName }
  });

  const [starRepo, mutationData] = useMutation<any, {repoId : number | string}>(STAR_REPO);

  const handleOrgNameChange = (e: InputChangeEvent) => {
    let { value } = e.currentTarget;
    setSearch({ ...search, orgName: value });
  };

  const handleRepoNameChange = (e: InputChangeEvent) => {
    let { value } = e.currentTarget;
    setSearch({ ...search, repoName: value });
  }; 

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchQuery();
    if (data) {
      setRepo(data.repository);
    }
  };

  return (
    <div className="repo-search">
      <form onSubmit={handleSearch}>
        <label>Organization</label>
        <input
          type="text"
          onChange={handleOrgNameChange}
          value={search.orgName}
        />
        <label>Repository</label>
        <input
          type="text"
          onChange={handleRepoNameChange}
          value={search.repoName}
        />
        <button type="submit">Search</button>
      </form>
      {repo.id && (
        <div className="repo-item">
          <h4>
            {repo.name}
            {repo.stargazers ? ` ${repo.stargazers.totalCount} stars` : ""}
          </h4>
          <p>{repo.description}</p>
          <div>
            {!repo.viewerHasStarred && (
              <button onClick={() => {
                starRepo({variables : {repoId : repo.id}})
              }}>Star</button>
            )}
          </div>
          <div>
            Last 5 issues:
            {repo.issues && repo.issues.edges ? (
              <ul>
                {repo.issues.edges.map(item => (
                  <li key={item.node.id}>{item.node.title}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoSearch;
