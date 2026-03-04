import './index.scss';

/** @desc 加载中组件 */
export const Loading = () => {
  return (
    <div id="loading">
      <p>Generating terrain...</p>
      <div id="loading-progress">
        <div id="loading-progress-bar"></div>
      </div>
    </div>
  )
}