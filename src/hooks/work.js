import { useEffect, useState } from "react"
import { useHistory } from "react-router";
import { WorkService, AuthService as UserService } from "../api";
import { useUser } from "./user";

export const useWork = (workCode, loadedWork=null, loadedProfile=null) => {
    const { user, setUser } = useUser();
    const history = useHistory();

    const [profile, setProfile] = useState(loadedProfile);
    const [work, setWork] = useState(loadedWork);

    /**
     * 
     * @param {*} workCode 
     * @returns 
     */
    const fetchWork = async (workCode) => {
        const response = await WorkService.getWork(workCode);
        const { work, user } = response?.result;
        return {
            work,
            user
        };
    }

    /**
     * Update statement
     * @param {*} statement 
     * @returns 
     */
    const updateStatement = async (statement) => {
        const response = await WorkService.updateWork(
            work.artis_code,
            {artist_statement: statement}
        );

        if (response?.result) {
            setWork({
                ...work,
                artist_statement: response.result.artist_statement
            });
        }
    }

    const handleBioUpdate = async (body) => {
        const response = await UserService.updateBio(
            body,
        );
        if (response?.result) {
            const { artist_bio, artist_website } = response.result;
            setUser({
                ...user,
                profile: { ...user.profile, artist_bio, artist_website },
            });
        }
    }

    const handleTagsUpdate = async (tags) => {
        const response = await WorkService.updateWork(
            work.artis_code,
            {tags}
        );
        if (response?.result) {
            setWork({
                ...work,
                tags: response.result.tags,
            });
        }
    }

    const handleWarningEmail = async (body) => {
        const response = await WorkService.sendWarningEmail(
            work.artis_code,
            body
        );
        if (response?.result) return response.result;
        return null;
    }

    const getWarnings = async () => {
        const response = await WorkService.getPreviousWarnings(
            work.artis_code,
        );
        if (response?.result) return response.result;
        return [];
    }

    useEffect(() => {
        let isMounted = true;

        if (loadedProfile && loadedWork) {
            setWork(loadedWork);
            setProfile(loadedProfile);
        }
        else if (workCode) {
            fetchWork(workCode).then(({work, user}) => {
                if (isMounted) {
                    setWork(work);
                    setProfile(user);
                }
            });
        }
        else if (!loadedProfile && !loadedWork) {
            history.push("/works");
        }
        return () => { isMounted = false };
    }, [workCode, loadedProfile, loadedWork]);


    return {
        profile, work,
        handleBioUpdate,
        handleTagsUpdate,
        handleWarningEmail,
        handleUpdateStatement: updateStatement,
        getWarnings,
    };
}