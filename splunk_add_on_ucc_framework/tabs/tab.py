#
# Copyright 2024 Splunk Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from typing import Dict, Any, Optional, List


class Tab(Dict[str, Any]):
    @property
    def name(self) -> str:
        return self["name"]

    @property
    def title(self) -> str:
        return self["title"]

    @property
    def entity(self) -> List[Dict[str, Any]]:
        return self["entity"]

    @property
    def tab_type(self) -> Optional[str]:
        return self.get("type")

    def render(self) -> Dict[str, Any]:
        return dict(self)

    @classmethod
    def from_definition(cls, definition: Dict[str, Any]) -> Optional["Tab"]:
        return cls(definition)