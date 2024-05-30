
import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();


router.get('/:username', async (req, res) => {

    const { username } = req.params;
  
    if (!username) {
      return res.send(error('Missing required fields'));
    }

    // Call the GitHub API

    const headers = { Authorization: `Bearer Token`}

    const response = await fetch(`https://api.github.com/users/${username}`, {method:"GET", headers:headers});
    const data = await response.json();

    if (data.message === 'Not Found') {
      return res.send(error('User not found'));
    }

    const repos = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {method:"GET", headers:headers});
    const reposData = await repos.json();

    var langs = {};

    var fork_count = 0;

    for (const e of reposData ){

        fork_count += e.forks_count;

        var languages = await fetch(e.languages_url, {method:"GET", headers:headers});
        langs = combine(langs, await languages.json());
    }

    const entries = Object.entries(langs);
    const sorted = entries.sort(([,a], [,b]) => a - b).reverse();

    let sum = sorted.reduce((accumulator, lang) => {
        return accumulator + lang[1];
    }, 0);
    
    return res.send(success({...data, repos: reposData, fork_count: fork_count, langs: sorted, langs_sum: sum}));

  });

  

function success(data = {}) {
    return {
        success: true,
        data
    }
}

function received() {
    return {
        success: true,
        status: 'received'
    }
}

function error(error) {
    return {
        success: false,
        error
    }
}

function combine(dict1, dict2) {
    const result = { ...dict1 };

    for (const key in dict2) {
        if (result.hasOwnProperty(key)) {
            result[key] += dict2[key];
        } else {
            result[key] = dict2[key];
        }
    }

    //console.log(dict1, dict2, result)
    return result;
}

export default router