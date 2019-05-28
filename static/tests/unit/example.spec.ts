import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Lookup from '@/components/Lookup.vue'

describe('Lookup.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'lookup';
    const wrapper = shallowMount(Lookup, {
      propsData: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
