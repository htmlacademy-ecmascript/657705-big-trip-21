import { render, RenderPosition } from '@src/render';

import FilterView from '@src/view/filter-view';
import InfoView from '@src/view/info-view';
import TripListPresenter from '@src/presenter/trip-list-presenter';

const headerNode = document.querySelector('.page-header');
const headerInfoNode = headerNode.querySelector('.trip-main');
const headerFilterNode = headerNode.querySelector('.trip-controls__filters');

render(new InfoView(), headerInfoNode, RenderPosition.AFTERBEGIN);
render(new FilterView(), headerFilterNode);

new TripListPresenter().init();
