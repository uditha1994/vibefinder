import '../../styles/FilterBar.css'

const FilterBar = ({ filters, onFilterChange }) => {
    const handleFilterUpdate = (filterType, value) => {
        const newFilters = {
            ...filters,
            [filterType]: value
        };
        onFilterChange(newFilters);
    }

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label>Duration:</label>
                <select
                    value={filters.duration}
                    onChange={(e) => handleFilterUpdate('duration', e.target.value)}
                >
                    <option value="any">Any Duration</option>
                    <option value="short">Short Videos</option>
                    <option value="medium">Medium Videos </option>
                    <option value="long">Long Content</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Upload Date:</label>
                <select
                    value={filters.uploadDate}
                    onChange={(e) => handleFilterUpdate('uploadDate', e.target.value)}
                >
                    <option value="any">Any Time</option>
                    <option value="hour">Last Hour</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Sort By:</label>
                <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
                >
                    <option value="relavance">Relavance</option>
                    <option value="date">Upload Date</option>
                    <option value="rating">Rating</option>
                    <option value="viewCount">View Count</option>
                </select>
            </div>
        </div>
    )
};

export default FilterBar;