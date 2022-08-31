import * as userRepository from "../repositories/userRepository.js"
import axios from "axios"

export async function getRanking(){
    return userRepository.getRanking();
}

async function getUserRepos(username: string){
    const {data} = await axios.get(`https://api.github.com/users/${username}/repos`);
    return data;
}

async function getUser(username: string){
    const user = await userRepository.findByUsername(username);

    if(!user){
        const createdUser = await userRepository.insert(username);
        return {id: createdUser.id, username, wins:0, losses:0, draws: 0};
    }

    return user
}

async function getUserStarCount(userRepos: any[]){
    const repoStars = userRepos.map((repo) => repo.stargazers_count);
    if(repoStars.length === 0) return 0;

    return repoStars.reduce((current:number, sum: number) => sum + current);
}

async function getFightResult(firstFighter: any, secondFighter: any, firstUserStarCount: number, secondUserStarCount: number) {
    if( firstUserStarCount > secondUserStarCount){
        await updateWinnerAndLoserStats(firstFighter.id, secondFighter.id);

        return{
            winner: firstFighter.username,
            loser: secondFighter.username,
            draw: false,
        }
    }

    if( secondUserStarCount > firstUserStarCount ) {
        await updateWinnerAndLoserStats (secondFighter.id, firstFighter.id);
        return{
            winner: secondFighter.username,
            loser: firstFighter.username,
            draw: false,
        }
    }

    await updateDrawStats(firstFighter.id, secondFighter.id);
    return { winner: null, loser: null, draw: true}
}

async function updateWinnerAndLoserStats(winnerId: number, loserId: number) {
    await userRepository.updateStats(winnerId, "wins");
    await userRepository.updateStats(loserId, "losses");
  }
  
  async function updateDrawStats(firstFighterId: number, secondFighterId: number) {
    await userRepository.updateStats(firstFighterId, "draws");
    await userRepository.updateStats(secondFighterId, "draws");
  }

export async function fight( firstUser: string, secondUser: string){
    const firstUserRepos = await getUserRepos(firstUser);
    const secondUserRepos = await getUserRepos(secondUser);

    const firstUserInfo= await getUser(firstUser);
    const secondUserInfo = await getUser(secondUser);

    const firstUserStarCount = getUserStarCount(firstUserInfo);
    const secondUserStarCount = getUserStarCount(secondUserInfo);

    return getFightResult ( firstUserInfo, secondUserInfo, firstUserStarCount, secondUserStarCount)

}