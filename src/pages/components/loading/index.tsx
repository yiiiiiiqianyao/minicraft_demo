import './index.scss';

export const Loading = () => {
    return (
      <div id="loading">
        <p>Loading Level</p>
        <p>Generating terrain</p>
        <div id="loading-progress">
          <div id="loading-progress-bar"></div>
        </div>
      </div>
    )
}