import {getMaxDepth} from './positions';

describe('position tests', () => {

  it('should be level 2', () => {

  const   items = [
      {
        name: 'Individual over greater things ',
        value: 190,
        color: '#f6951f',
        children: [
          {
            name: 'Time Management',
            value: 5,
            children: [
              {
                name: 'inner Time Management',
                value: 5,
              }
            ]
          }, {
            name: 'Prioritization',
            value: 70
          }, {
            name: 'Focus',
            value: 30
          }, {
            name: 'Time Management',
            value: 5
          }, {
            name: 'Prioritization',
            value: 70
          }, {
            name: 'Focus',
            value: 30
          }, {
            name: 'Time Management',
            value: 5
          }, {
            name: 'Prioritization',
            value: 70
          }, {
            name: 'Focus',
            value: 30
          }
        ]

      },
      {
        name: 'Enterprise Agility ',
        value: 90,
        color: '#b24bb7'


      },
      {
        name: 'Teamwork',
        value: 50,
        color: '#3bb54a',
        children: [
          {
            name: 'Working Agreement',
            value: 40
          }, {
            name: 'Short Term Goals',
            value: 100
          }, {
            name: 'Team Meetings',
            value: 30
          }
        ]

      },
      {
        name: 'Facilitation',
        value: 75,
        color: '#6351a2',
        children: [
          {
            name: 'Engagement',
            value: 40
          }, {
            name: 'Preparation and design',
            value: 36
          }
        ]
      },


    ];


  expect(getMaxDepth(items)).toBe(3);
  });
});
