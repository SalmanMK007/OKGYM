import { useContext, useEffect, useState } from "react"

import WorkService from '../api/service';
import { useUser } from "./user";
import _ from "lodash";
import { WorksContext } from "../providers/works";

const validateQuery = (query) => {
    let result = {};
    if (query?.to !== '') result["to"]=query.to;
    if (query?.from !== '') result["from"]=query.from;
    if (query?.search !== '') result["search"]=query.search;
    if (query?.tags?.length !== 0) result["tags"]=query.tags;
    return result;
}

export const useWorks = () => {
    const { user } = useUser();
    const {
        works, 
        queryForm, 
        worksPerPage, 
        page,
        setWorks, 
        setPage, 
        setWorksPerPage, 
        setQueryForm, 
        view, 
        setView,
        worksIsLoading, 
        setWorksIsLoading
    } = useContext(WorksContext);
    
    const [sort, setSort] = useState('registered_date,desc');
    const [pageItems, setPageItems] = useState([]);
    const [isQueryActive, setIsQueryActive] = useState(false);
    const [count, setCount] = useState(works?.length || 0);

    /**
     * Get page items given current page and items per page
     * @param {*} items 
     * @param {*} cur 
     * @param {*} perPage 
     * @returns 
     */
    const getPageItems = (items, cur, perPage) => {
        if (items.length < perPage * cur) {
            return items.slice(perPage * (cur-1));
        } else {
            return items.slice(perPage * (cur-1), perPage * cur);
        }
    }

    /**
     * Filter works given filter values
     * @param {*} view 
     * @param {*} sort 
     * @param {*} queryForm 
     */
    const filterWorks = (items, page, perPage, sort) => {
        const [value, order] = sort.split(',');

        if (items.length === 0) return [];

        const orderField = value === 'title'
            ? [obj => obj.title.toLowerCase()[0]]
            : ['registered_date'];
        
        let orderedWorks = _.orderBy(items, orderField, [order]);

        const curItems = getPageItems(orderedWorks, page, perPage);

        const filterFunction = value === 'title'
            ? obj => obj?.title.toLowerCase()[0]
            : obj => new Date(obj.registered_date).toLocaleString('default', { month: 'long' });
        
        const result = _.groupBy(curItems, filterFunction);
        return result;
    }

    const getAll = async (refresh=false) => {
        setWorksIsLoading(true);
        let response = await WorkService.getWorks(validateQuery(queryForm));
        setWorksIsLoading(false);
        if (isQueryActive) {
            setPageItems(filterWorks(response?.result || [], page, worksPerPage, sort));
        } else {
            setWorks(response?.result || []);
            setCount(response?.result?.length || 0);
            setPageItems(filterWorks(response?.result || [], page, worksPerPage, sort));
        }
    }

    useEffect(() => {
        if (user || queryForm) {
            getAll();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, queryForm]);

    useEffect(() => {
        setPageItems(filterWorks(works, page, worksPerPage, sort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, worksPerPage, sort]);

    return { 
        count,
        works: pageItems,
        worksPerPage, 
        setWorksPerPage, 
        page, 
        setCurPage: setPage,
        sort,
        setSort,
        queryForm, 
        setQueryForm,
        isQueryActive,
        setIsQueryActive,
        view,
        setView,
        worksIsLoading
    };
}
