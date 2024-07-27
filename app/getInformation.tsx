// getInformation.tsx
"use client";
import React, { useState, useEffect } from "react";

type User = {
  username: string;
  full_name: string;
};

type EdgeNode = {
  node: User;
};

type PageInfo = {
  has_next_page: boolean;
  end_cursor: string | null;
};

type FollowersResponse = {
  data: {
    user: {
      edge_followed_by: {
        edges: EdgeNode[];
        page_info: PageInfo;
      };
    };
  };
};

type FollowingsResponse = {
  data: {
    user: {
      edge_follow: {
        edges: EdgeNode[];
        page_info: PageInfo;
      };
    };
  };
};

interface GetInformationProps {
  username: string;
}

const getInformation = async (username: string) => {
  const followers: User[] = [];
  const followings: User[] = [];
  const dontFollowMeBack: User[] = [];
  const iDontFollowBack: User[] = [];

  try {
    console.log(`Process started! Give it a couple of seconds`);

    // Fetch user ID
    const userQueryRes = await fetch(
      `https://www.instagram.com/web/search/topsearch/?query=${username}`
    );
    const userQueryJson = await userQueryRes.json();
    const userId = userQueryJson.users
      .map((u: any) => u.user)
      .filter((u: any) => u.username === username)[0].pk;

    // Fetch followers
    let after: string | null = null;
    let has_next = true;

    while (has_next) {
      const followersRes: FollowersResponse = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
          encodeURIComponent(
            JSON.stringify({
              id: userId,
              include_reel: true,
              fetch_mutual: true,
              first: 50,
              after: after,
            })
          )
      ).then((res) => res.json());

      has_next =
        followersRes.data.user.edge_followed_by.page_info.has_next_page;
      after = followersRes.data.user.edge_followed_by.page_info.end_cursor;
      followers.push(
        ...followersRes.data.user.edge_followed_by.edges.map(({ node }) => ({
          username: node.username,
          full_name: node.full_name,
        }))
      );
    }

    // Fetch followings
    after = null;
    has_next = true;

    while (has_next) {
      const followingsRes: FollowingsResponse = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
          encodeURIComponent(
            JSON.stringify({
              id: userId,
              include_reel: true,
              fetch_mutual: true,
              first: 50,
              after: after,
            })
          )
      ).then((res) => res.json());

      has_next = followingsRes.data.user.edge_follow.page_info.has_next_page;
      after = followingsRes.data.user.edge_follow.page_info.end_cursor;
      followings.push(
        ...followingsRes.data.user.edge_follow.edges.map(({ node }) => ({
          username: node.username,
          full_name: node.full_name,
        }))
      );
    }

    // Calculate users who don't follow back and those you don't follow back
    dontFollowMeBack.push(
      ...followings.filter(
        (following) =>
          !followers.find(
            (follower) => follower.username === following.username
          )
      )
    );

    iDontFollowBack.push(
      ...followers.filter(
        (follower) =>
          !followings.find(
            (following) => following.username === follower.username
          )
      )
    );

    console.log({ iDontFollowBack });

    console.log(
      `Process is done: Type 'copy(followers)' or 'copy(followings)' or 'copy(dontFollowMeBack)' or 'copy(iDontFollowBack)' in the console and paste it into a text editor to take a look at it'`
    );

    return { followers, followings, dontFollowMeBack, iDontFollowBack };
  } catch (err) {
    console.log({ err });
    return { followers, followings, dontFollowMeBack, iDontFollowBack };
  }
};

const GetInformation: React.FC<GetInformationProps> = ({ username }) => {
  const [data, setData] = useState<{
    followers: User[];
    followings: User[];
    dontFollowMeBack: User[];
    iDontFollowBack: User[];
  }>({
    followers: [],
    followings: [],
    dontFollowMeBack: [],
    iDontFollowBack: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getInformation(username);
      setData(result);
    };

    fetchData();
  }, [username]);

  return (
    <div>
      <h1>Instagram Followers Info</h1>
      <div>
        <h2>Followers</h2>
        <ul>
          {data.followers.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Followings</h2>
        <ul>
          {data.followings.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Don't Follow Me Back</h2>
        <ul>
          {data.dontFollowMeBack.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>I Don't Follow Back</h2>
        <ul>
          {data.iDontFollowBack.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GetInformation;
