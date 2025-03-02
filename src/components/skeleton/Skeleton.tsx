import React from 'react'
import SkeletonLandingPage from './SkeletonLandingPage'
import SkeletonList from './SkeletonList'
import SkeletonListDetail from './SkeletonListDetail'
import SkeletonProfile from './SkeletonProfile'

function Skeleton(props: any) {
    if(props.type === "landing") return <SkeletonLandingPage />
    if(props.type === "list") return <SkeletonList />
    if(props.type === "profile") return <SkeletonProfile />
    if(props.type === "list-detail") return <SkeletonListDetail />
}

export default Skeleton