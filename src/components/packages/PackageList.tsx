import type { Package } from '@/payload-types'
import { PackageCard } from './PackageCard'
import { catalogGroups } from '@/data/catalog'
import { Icon } from '@/components/ui/Icon'

export function PackageList({ packages }: { packages: Package[] }) {
  return <div id="goi-cuoc" className="catalog">
    {catalogGroups.map((group, index) => {
      const items = packages.filter((item) => item.catalogGroup === group.id)
      return <section id={group.id} key={group.id} className={`catalog-section catalog-section--${group.id}`}>
        <div className="container">
          <div className="section-heading"><div className="section-heading-text">
            <h2>{group.title}</h2><p>{group.description}</p>
          </div><span className="section-emblem"><Icon name={group.icon} width="34" height="34" /></span></div>
          {items.length > 0 ? <div className={`package-grid package-grid--${items.length}`} role="region" aria-label={group.title} tabIndex={0}>{items.map((item) => <PackageCard key={item.id} item={item} />)}</div>
            : <p className="notice">Danh mục đang được đồng bộ. Vui lòng quay lại sau ít phút.</p>}
        </div>
      </section>
    })}
  </div>
}
