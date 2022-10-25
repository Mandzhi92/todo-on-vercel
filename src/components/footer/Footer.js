import './Footer.css';
import PropTypes from 'prop-types';

import TasksFilter from '../tasks-filter';

function Footer(props) {
  const { onFilterChange, filter, onClearCompleted, isCompletedTasksCount } = props;

  return (
    <footer className="footer">
      <span className="todo-count">{`${isCompletedTasksCount} items left`}</span>
      <TasksFilter onFilterChange={onFilterChange} filter={filter} />
      <button type="button" className="clear-completed" onClick={onClearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}

Footer.defaultProps = {
  isCompletedTasksCount: 'N',
  onFilterChange: 'all',
  filter: 'all',
};
Footer.propTypes = {
  isCompletedTasksCount: PropTypes.string,
  onFilterChange: PropTypes.func,
  filter: PropTypes.string,
};

export default Footer;
