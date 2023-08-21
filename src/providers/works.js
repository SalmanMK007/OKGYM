import { useState, createContext, useEffect } from 'react';

export const WorksContext = createContext({
    works: [],
    setWorks: () => {},
    page: 1,
    setPage: () => {},
    worksPerPage: 20,
    setWorksPerPage: () => {},
    queryForm: {},
    setQueryForm: () => {},
    sort: 'registered_date,desc',
    setSort: () => {},
    worksIsLoading: false
});

const defaultQueryForm = {
    search: '',
    tags: [],
    from: '',
    to: ''
};

const WorksProvider = ({ children }) => {
    // const storedWorks = localStorage.getItem('works');
    const [works, setWorks] = useState([]);
    const storedView = localStorage.getItem('view');

    const [view, setView] = useState(storedView || "list")
    const storedPage = localStorage.getItem('page');
    const [page, setPage] = useState(storedPage || 1);
    
    const storedWorksPerPage = localStorage.getItem('worksPerPage');
    const [worksPerPage, setWorksPerPage] = useState(storedWorksPerPage);
    
    const storedQueryForm = localStorage.getItem('queryForm');

    const [queryForm, setQueryForm] = useState(
        storedQueryForm ? JSON.parse(storedQueryForm) : defaultQueryForm
    );

    const [worksIsLoading, setWorksIsLoading] = useState(false);

    useEffect(() => {
        // localStorage.setItem('works', JSON.stringify(works.length ? works : []));
        localStorage.setItem('page', page ? page : 1);
        localStorage.setItem('worksPerPage', worksPerPage ? worksPerPage : 20);
        localStorage.setItem('queryForm', JSON.stringify(queryForm ? queryForm : defaultQueryForm));
        localStorage.setItem('view', view)
    }, [works, page, worksPerPage, queryForm, view]);

    return <WorksContext.Provider
        value={{
            works,
            setWorks,
            page,
            setPage,
            worksPerPage,
            setWorksPerPage,
            queryForm,
            setQueryForm,
            view,
            setView,
            worksIsLoading,
            setWorksIsLoading
        }}
    >
        {children}
    </WorksContext.Provider>;
}

export default WorksProvider;
