import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { minBy, maxBy, noop, uniqBy, map } from 'lodash';
import d3Scale from 'd3-scale';

import { dataGenerator } from '../../../test-utils';

import { MultiScatter, Scatter } from '../';

chai.use(chaiEnzyme());

describe('<MultiScatter />', () => {
  const chartDimensions = {
    width: 600,
    height: 400
  };

  const dataAccessors = {
    x: 'year_id',
    y: 'population'
  };

  describe('scatter plot of a dataset', () => {
    const data = dataGenerator({
      primaryKeys: [{ name: 'location', values: ['USA', 'Canada', 'Mexico'] }],
      valueKeys: [{ name: 'population', range: [300, 600], uncertainty: false }],
      length: 10
    });

    const scatterData = [
      {
        location: 'USA',
        values: data.filter((datum) => { return datum.location === 'USA'; })
      },
      {
        location: 'Canada',
        values: data.filter((datum) => { return datum.location === 'Canada'; })
      },
      {
        location: 'Mexico',
        values: data.filter((datum) => { return datum.location === 'Mexico'; })
      }
    ];

    const yDomain = [minBy(data, 'population').population, maxBy(data, 'population').population];
    const xDomain = map(uniqBy(data, 'year_id'), (obj) => { return (obj.year_id); });

    const xScale = d3Scale.scalePoint().domain(xDomain).range([0, chartDimensions.width]);
    const yScale = d3Scale.scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);

    const symbolScale = d3Scale.scaleOrdinal()
        .domain(['USA', 'Canada', 'Mexico'])
        .range(['circle', 'star', 'square']);
    const colorScale = d3Scale.scaleOrdinal()
        .domain(['USA', 'Canada', 'Mexico'])
        .range(['red', 'blue', 'green']);

    let component;

    before(() => {
      component = (
        <MultiScatter
          data={scatterData}
          dataAccessors={dataAccessors}
          dataField="values"
          focus={data[0]}
          focusedClassName="focused"
          focusedStyle={{ stroke: 'yellow' }}
          keyField="location"
          onClick={noop}
          onMouseLeave={noop}
          onMouseMove={noop}
          onMouseOver={noop}
          selection={[]}
          selectedClassName="selected"
          selectedStyle={{ stroke: 'red' }}
          scatterClassName="scatter"
          size={128}
          symbolField="location"
          symbolScale={symbolScale}
          colorScale={colorScale}
          scales={{ x: xScale, y: yScale }}
          style={{ strokeWeight: 2 }}
          symbolClassName="symbol"
        />
      );
    });

    it('contains 3 scatter plots', () => {
      const wrapper = shallow(component);
      expect(wrapper.find(Scatter)).to.have.length(3);
    });

    it('passes specified properties to its children', () => {
      const nonInheritedProps = [
        'dataField',
        'keyField',
        'scatterClassName',
        'symbolField',
        'symbolScale',
      ];
      const assertion = (symbol) => {
        nonInheritedProps.forEach(prop => {
          expect(symbol).to.not.have.prop(prop);
        });
      };
      shallow(component).find(Scatter).forEach(assertion);
    });

    it('does not pass specified properties to its children', () => {
      const inheritedProps = [
        'className',
        'data',
        'dataAccessors',
        'fill',
        'focus',
        'focusedClassName',
        'focusedStyle',
        'onClick',
        'onMouseLeave',
        'onMouseMove',
        'onMouseOver',
        'selectedClassName',
        'selectedStyle',
        'selection',
        'scales',
        'size',
        'style',
        'symbolClassName',
        'symbolType',
      ];
      const assertion = (symbol) => {
        inheritedProps.forEach(prop => {
          expect(symbol).to.have.prop(prop);
        });
      };
      shallow(component).find(Scatter).forEach(assertion);
    });
  });
});
