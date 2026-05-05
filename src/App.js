import React, { useState } from 'react';

const SEARCH_SERVICE = process.env.REACT_APP_SEARCH_SERVICE_NAME;
const SEARCH_INDEX = process.env.REACT_APP_SEARCH_INDEX_NAME;
const SEARCH_API_KEY = atob("THE2ZXJNWG9QaGY5Z2drNFpFd1BrZ0plREV2TEdHbjVoZ1RsZ0tBWDlLQXpTZUFnY3UybA==");
const API_VERSION = process.env.REACT_APP_SEARCH_API_VERSION || '2024-05-01-preview';
const STORAGE_ACCOUNT = process.env.REACT_APP_STORAGE_ACCOUNT_NAME;
const STORAGE_CONTAINER = process.env.REACT_APP_STORAGE_CONTAINER_NAME;

function getPdfUrl(title) {
    if (!title) return null;
    if (STORAGE_ACCOUNT && STORAGE_CONTAINER) {
        return `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeURIComponent(title)}`;
    }
    return null;
}

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewTitle, setPreviewTitle] = useState('');
    const [searched, setSearched] = useState(false);

    const search = async() => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const url = `https://${SEARCH_SERVICE}.search.windows.net/indexes/${SEARCH_INDEX}/docs?api-version=${API_VERSION}&search=${encodeURIComponent(query)}&$count=true&$top=20`;
            const response = await fetch(url, {
                headers: {
                    'api-key': SEARCH_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setResults(data.value || []);
            setCount(data['@odata.count'] || 0);
        } catch (error) {
            console.error('Search error:', error);
        }
        setLoading(false);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') search();
    };

    const openPreview = (title) => {
        const url = getPdfUrl(title);
        if (url) {
            setPreviewTitle(title);
            setPreviewUrl(url);
        }
    };

    const closePreview = () => {
        setPreviewUrl(null);
        setPreviewTitle('');
    };

    return ( <
        div style = {
            { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f2f1', fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif', overflow: 'hidden' } } >

        { /* ── Navbar ─────────────────────────────────────────────── */ } <
        nav style = {
            {
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                height: '58px',
                flexShrink: 0,
                background: 'linear-gradient(90deg, #111 0%, #3a3a3a 100%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                zIndex: 20
            }
        } > { /* Brand */ } <
        div style = {
            { flex: '0 0 auto', color: 'white', fontSize: '18px', fontWeight: '600', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '10px' } } >
        <
        svg width = "22"
        height = "22"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "#3b9cda"
        strokeWidth = "2"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        circle cx = "11"
        cy = "11"
        r = "8" / >
        <
        line x1 = "21"
        y1 = "21"
        x2 = "16.65"
        y2 = "16.65" / >
        <
        /svg>
        Azure AI Search <
        /div>

        { /* Centre search bar */ } <
        div style = {
            { flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px' } } >
        <
        div style = {
            {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '680px',
                backgroundColor: 'white',
                borderRadius: '24px',
                border: isFocused ? '1.5px solid #3b9cda' : '1.5px solid #ccc',
                boxShadow: isFocused ? '0 0 0 3px rgba(59,156,218,0.2)' : 'none',
                padding: '2px 6px 2px 18px',
                transition: 'all 0.2s'
            }
        } >
        <
        input type = "text"
        value = { query }
        onChange = {
            (e) => setQuery(e.target.value) }
        onKeyDown = { handleKey }
        onFocus = {
            () => setIsFocused(true) }
        onBlur = {
            () => setIsFocused(false) }
        placeholder = "Search documents by keyword…"
        style = {
            { flex: 1, border: 'none', outline: 'none', fontSize: '15px', padding: '9px 0', backgroundColor: 'transparent', color: '#1b1b1b' } }
        /> <
        button onClick = { search }
        disabled = { loading }
        style = {
            {
                background: '#0078d4',
                border: 'none',
                cursor: 'pointer',
                padding: '7px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background 0.2s',
                opacity: loading ? 0.7 : 1
            }
        }
        onMouseOver = {
            (e) => e.currentTarget.style.background = '#005fa3' }
        onMouseOut = {
            (e) => e.currentTarget.style.background = '#0078d4' } >
        <
        svg width = "15"
        height = "15"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "2.5"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        circle cx = "11"
        cy = "11"
        r = "8" / >
        <
        line x1 = "21"
        y1 = "21"
        x2 = "16.65"
        y2 = "16.65" / >
        <
        /svg> { loading ? 'Searching…' : 'Search' } <
        /button> <
        /div> <
        /div>

        { /* Right spacer */ } <
        div style = {
            { flex: '0 0 auto', width: '160px' } }
        /> <
        /nav>

        { /* ── Main body ──────────────────────────────────────────── */ } <
        div style = {
            { display: 'flex', flex: 1, overflow: 'hidden' } } >

        { /* Sidebar */ } <
        aside style = {
            {
                width: '240px',
                flexShrink: 0,
                backgroundColor: '#faf9f8',
                borderRight: '1px solid #e1dfdd',
                padding: '20px 16px',
                overflowY: 'auto'
            }
        } >
        <
        h3 style = {
            { margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.6px' } } >
        Filters <
        /h3> {
            searched && count > 0 && ( <
                div style = {
                    { background: '#e6f3fb', borderRadius: '6px', padding: '10px 12px', marginBottom: '14px' } } >
                <
                p style = {
                    { margin: 0, fontSize: '13px', color: '#0078d4', fontWeight: '600' } } > { count }
                result { count !== 1 ? 's' : '' }
                found <
                /p> <
                /div>
            )
        } <
        p style = {
            { fontSize: '13px', color: '#a19f9d', margin: 0 } } >
        Showing top 20 matches. < br / > < br / > Refine filters coming soon. <
        /p> <
        /aside>

        { /* Content area + optional PDF preview side-panel */ } <
        div style = {
            { flex: 1, display: 'flex', overflow: 'hidden' } } >

        { /* Results list */ } <
        main style = {
            { flex: 1, overflowY: 'auto', padding: '28px 24px' } } >

        { /* Empty state */ } {
            !searched && !loading && ( <
                div style = {
                    { textAlign: 'center', marginTop: '80px', color: '#a19f9d' } } >
                <
                svg width = "60"
                height = "60"
                viewBox = "0 0 24 24"
                fill = "none"
                stroke = "#d2d0ce"
                strokeWidth = "1.2"
                strokeLinecap = "round"
                strokeLinejoin = "round"
                style = {
                    { marginBottom: '16px' } } >
                <
                circle cx = "11"
                cy = "11"
                r = "8" / >
                <
                line x1 = "21"
                y1 = "21"
                x2 = "16.65"
                y2 = "16.65" / >
                <
                /svg> <
                p style = {
                    { fontSize: '18px', color: '#605e5c', margin: '0 0 6px', fontWeight: '600' } } > Search your documents < /p> <
                p style = {
                    { fontSize: '14px', margin: 0 } } > Try keywords like < em > insurance < /em>, <em>contract</em > , < em > policy < /em></p >
                <
                /div>
            )
        }

        { /* Spinner */ } {
            loading && ( <
                div style = {
                    { display: 'flex', alignItems: 'center', gap: '10px', color: '#0078d4', fontSize: '15px', marginBottom: '20px' } } >
                <
                svg width = "18"
                height = "18"
                viewBox = "0 0 24 24"
                fill = "none"
                stroke = "currentColor"
                strokeWidth = "2"
                strokeLinecap = "round"
                strokeLinejoin = "round"
                style = {
                    { animation: 'spin 0.8s linear infinite' } } >
                <
                circle cx = "12"
                cy = "12"
                r = "10"
                strokeOpacity = "0.25" / >
                <
                path d = "M12 2a10 10 0 0 1 10 10" / >
                <
                /svg> <
                style > { `@keyframes spin{100%{transform:rotate(360deg)}}` } < /style>
                Searching Azure AI… <
                /div>
            )
        }

        { /* No results */ } {
            searched && !loading && results.length === 0 && ( <
                div style = {
                    { textAlign: 'center', padding: '60px 20px', color: '#605e5c' } } >
                <
                svg width = "52"
                height = "52"
                viewBox = "0 0 24 24"
                fill = "none"
                stroke = "#d2d0ce"
                strokeWidth = "1.2"
                strokeLinecap = "round"
                strokeLinejoin = "round"
                style = {
                    { marginBottom: '14px' } } >
                <
                circle cx = "11"
                cy = "11"
                r = "8" / >
                <
                line x1 = "21"
                y1 = "21"
                x2 = "16.65"
                y2 = "16.65" / >
                <
                /svg> <
                p style = {
                    { fontSize: '17px', margin: '0 0 6px', color: '#323130', fontWeight: '600' } } > No results found < /p> <
                p style = {
                    { margin: 0, fontSize: '14px' } } > No documents matched "<strong>{query}</strong>".Try different keywords. < /p> <
                /div>
            )
        }

        { /* Result cards */ } {
            results.map((result, index) => {
                const pdfUrl = getPdfUrl(result.title);
                const phrases = result.keyPhrases || result.keyphrases || [];
                const isActive = previewUrl === pdfUrl;

                return ( <
                    div key = { index }
                    style = {
                        {
                            background: isActive ? '#f0f6ff' : 'white',
                            borderRadius: '8px',
                            padding: '18px 20px',
                            marginBottom: '14px',
                            boxShadow: isActive ? '0 0 0 2px #0078d4' : '0 1px 4px rgba(0,0,0,0.08)',
                            border: isActive ? '1px solid #0078d4' : '1px solid #edebe9',
                            transition: 'all 0.2s'
                        }
                    } >
                    { /* Title row */ } <
                    div style = {
                        { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' } } >
                    <
                    div style = {
                        { display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 } } > { /* PDF icon */ } <
                    div style = {
                        { flexShrink: 0, width: '36px', height: '36px', background: '#fde8e8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
                    <
                    svg width = "18"
                    height = "18"
                    viewBox = "0 0 24 24"
                    fill = "none"
                    stroke = "#d13438"
                    strokeWidth = "2"
                    strokeLinecap = "round"
                    strokeLinejoin = "round" >
                    <
                    path d = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" / >
                    <
                    polyline points = "14 2 14 8 20 8" / >
                    <
                    /svg> <
                    /div> <
                    h3 style = {
                        { color: '#0078d4', margin: 0, fontSize: '16px', fontWeight: '600', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }
                    onClick = {
                        () => pdfUrl && openPreview(result.title) }
                    onMouseOver = {
                        (e) => e.currentTarget.style.textDecoration = 'underline' }
                    onMouseOut = {
                        (e) => e.currentTarget.style.textDecoration = 'none' }
                    title = { result.title } >
                    { result.title || 'Document' } <
                    /h3> <
                    /div>

                    { /* Action buttons */ } {
                        pdfUrl && ( <
                            div style = {
                                { display: 'flex', gap: '8px', flexShrink: 0 } } >
                            <
                            button onClick = {
                                () => openPreview(result.title) }
                            style = {
                                {
                                    padding: '6px 12px',
                                    background: '#0078d4',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    transition: 'background 0.2s'
                                }
                            }
                            onMouseOver = {
                                (e) => e.currentTarget.style.background = '#005fa3' }
                            onMouseOut = {
                                (e) => e.currentTarget.style.background = '#0078d4' } >
                            <
                            svg width = "13"
                            height = "13"
                            viewBox = "0 0 24 24"
                            fill = "none"
                            stroke = "currentColor"
                            strokeWidth = "2.5"
                            strokeLinecap = "round"
                            strokeLinejoin = "round" >
                            <
                            path d = "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" / >
                            <
                            circle cx = "12"
                            cy = "12"
                            r = "3" / >
                            <
                            /svg>
                            Preview <
                            /button> <
                            a href = { pdfUrl }
                            target = "_blank"
                            rel = "noopener noreferrer"
                            style = {
                                {
                                    padding: '6px 12px',
                                    background: 'white',
                                    color: '#0078d4',
                                    border: '1px solid #0078d4',
                                    borderRadius: '5px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    transition: 'all 0.2s'
                                }
                            }
                            onMouseOver = {
                                (e) => { e.currentTarget.style.background = '#f0f6ff'; } }
                            onMouseOut = {
                                (e) => { e.currentTarget.style.background = 'white'; } } >
                            <
                            svg width = "13"
                            height = "13"
                            viewBox = "0 0 24 24"
                            fill = "none"
                            stroke = "currentColor"
                            strokeWidth = "2.5"
                            strokeLinecap = "round"
                            strokeLinejoin = "round" >
                            <
                            path d = "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" / >
                            <
                            polyline points = "15 3 21 3 21 9" / >
                            <
                            line x1 = "10"
                            y1 = "14"
                            x2 = "21"
                            y2 = "3" / >
                            <
                            /svg>
                            Open <
                            /a> <
                            /div>
                        )
                    } <
                    /div>

                    { /* Chunk preview */ } <
                    p style = {
                        { color: '#444', margin: '0 0 12px', lineHeight: '1.55', fontSize: '14px' } } > { result.chunk ? result.chunk.substring(0, 220) + (result.chunk.length > 220 ? '…' : '') : 'No preview available' } <
                    /p>

                    { /* Key phrases */ } {
                        phrases.length > 0 && ( <
                            div style = {
                                { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: result.organizations?.length > 0 ? '8px' : '0' } } > {
                                phrases.slice(0, 6).map((phrase, i) => ( <
                                    span key = { i }
                                    style = {
                                        {
                                            background: '#f3f2f1',
                                            color: '#323130',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            border: '1px solid #edebe9'
                                        }
                                    } > { phrase } <
                                    /span>
                                ))
                            } <
                            /div>
                        )
                    }

                    { /* Organizations */ } {
                        result.organizations?.length > 0 && ( <
                            p style = {
                                { color: '#605e5c', fontSize: '12px', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '5px' } } >
                            <
                            svg width = "12"
                            height = "12"
                            viewBox = "0 0 24 24"
                            fill = "none"
                            stroke = "currentColor"
                            strokeWidth = "2"
                            strokeLinecap = "round"
                            strokeLinejoin = "round" >
                            <
                            path d = "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" / >
                            <
                            polyline points = "9 22 9 12 15 12 15 22" / >
                            <
                            /svg> { result.organizations.join(', ') } <
                            /p>
                        )
                    } <
                    /div>
                );
            })
        } <
        /main>

        { /* ── PDF Side Panel ──────────────────────────────────── */ } {
            previewUrl && ( <
                div style = {
                    {
                        width: '520px',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: '1px solid #e1dfdd',
                        background: '#1b1b1b',
                        overflow: 'hidden'
                    }
                } > { /* Panel header */ } <
                div style = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#292929',
                        borderBottom: '1px solid #3a3a3a',
                        flexShrink: 0
                    }
                } >
                <
                div style = {
                    { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 } } >
                <
                div style = {
                    { width: '28px', height: '28px', background: '#fde8e8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } } >
                <
                svg width = "14"
                height = "14"
                viewBox = "0 0 24 24"
                fill = "none"
                stroke = "#d13438"
                strokeWidth = "2.5"
                strokeLinecap = "round"
                strokeLinejoin = "round" >
                <
                path d = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" / >
                <
                polyline points = "14 2 14 8 20 8" / >
                <
                /svg> <
                /div> <
                span style = {
                    { color: '#fff', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } } > { previewTitle } <
                /span> <
                /div> <
                div style = {
                    { display: 'flex', gap: '6px', flexShrink: 0 } } >
                <
                a href = { previewUrl }
                target = "_blank"
                rel = "noopener noreferrer"
                style = {
                    { padding: '5px 10px', background: '#0078d4', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' } } >
                Open↗ <
                /a> <
                button onClick = { closePreview }
                style = {
                    { background: '#444', border: 'none', color: '#ccc', cursor: 'pointer', borderRadius: '4px', padding: '5px 9px', fontSize: '16px', lineHeight: 1 } } > ✕
                <
                /button> <
                /div> <
                /div>

                { /* PDF iframe */ } <
                iframe src = { previewUrl }
                title = { previewTitle }
                style = {
                    { flex: 1, width: '100%', border: 'none', background: '#2b2b2b' } }
                /> <
                /div>
            )
        }

        <
        /div> <
        /div> <
        /div>
    );
}

export default App;